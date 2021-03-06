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
