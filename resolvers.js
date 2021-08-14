export const LIMIT = 10;

export const crudable = collection => paginable(resolvable(collection));

export const resolvable = collection =>
  Object.assign({}, collection, {
    save(input) {
      const object = { ...input };

      if (object._id) {
        this.update(object._id, { $set: { ...object } });
        return this.findOne(object._id);
      }
      delete object._id;
      return this.findOne(this.insert({ ...object }));
    },
    erase(_id) {
      const object = this.findOne(_id);
      this.remove(_id);
      return object;
    },
  });

export const paginable = collection =>
  Object.assign({}, collection, {
    findPaginated({ selector = {}, options = {}, paginationAction }) {
      const { skip = 0, limit = LIMIT } = paginationAction || {};
      const items = this.find(selector, {
        ...options,
        skip,
        limit,
      }).fetch();
      const total = this.find(selector).count();
      const nextSkip = skip + limit;
      const previousSkip = skip - limit;

      const totalPages =
        parseInt(total / limit, 10) + (total % limit > 0 ? 1 : 0);
      const currentPage =
        parseInt(skip / limit, 10) + (skip % limit > 0 ? 1 : 0) + 1;

      return {
        items,
        pagination: {
          total,
          totalPages,
          currentPage: totalPages ? currentPage : 0,
          first: { skip: 0, limit },
          last: { skip: (totalPages - 1) * limit, limit },
          ...(nextSkip < total ? { next: { skip: nextSkip, limit } } : {}),
          ...(previousSkip >= 0
            ? { previous: { skip: previousSkip, limit } }
            : {}),
        },
      };
    },
  });

export const createResolvers = ({
  collection,
  definition: definitionParam,
}) => {
  const definition = definitionParam || collection.definition;
  return {
    Query: {
      async [definition.graphQLOneQueryCamelCaseName](root, { _id }) {
        return collection.findOne(_id);
      },
      async [definition.graphQLManyQueryCamelCaseName]() {
        return collection.find().fetch();
      },
      async [definition.graphQLPaginatedQueryCamelCaseName](
        root,
        { paginationAction }
      ) {
        return collection.findPaginated({ paginationAction });
      },
    },
    Mutation: {
      async [definition.graphQLSaveMutationCamelCaseName](root, arg) {
        return collection.save(arg[definition.nameCamelCase]);
      },
      async [definition.graphQLEraseMutationCamelCaseName](root, { _id }) {
        return collection.erase(_id);
      },
    },
  };
};
