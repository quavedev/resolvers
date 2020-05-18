# quave:resolvers

`quave:resolvers` is a Meteor package that receives a defintion and generates resolvers.

## Why

We don't want to write the same resolvers all the time, for example, to list data, to get one specific record by id, to update data, etc. Then we have these common resolvers defined automatically.

We believe we are not reinventing the wheel in this package but what we are doing is like putting together the wheels in the vehicle :).

## Installation

```sh
meteor add quave:resolvers
```

## Usage

You will get automatically resolvers and methods in your collection.

### resolvable

Methods:
- `save(input)`: saves or update your data into a document.
- `erase(_id)`: removes your data using the _id.

You can apply this `resolvable` composer in your collection using `quave:collections` or manually to add new methods to your collection.

```javascript
import { createCollection } from 'meteor/quave:collections';
import { resolvable } from 'meteor/quave:resolvers';

import { PlayerSchema, PlayerDefinition } from './PlayersDefinitions';

export const PlayersCollection = createCollection({
  name: PlayerDefinition.pluralNameCamelCase,
  definition: PlayerDefinition,
  schema: PlayerSchema,
  composers: [resolvable],
});
```

### GraphQL

Resolvers and Schema (using `Player` as example but the names will be based in your definition):

```graphql
type Query {
  player(_id: ID!): Player
  players: [Player]
}      

type Mutation {
  savePlayer(player: PlayerInput!): Player
  erasePlayer(_id: ID!): Player
}      
```

You create your resolvers using the definition and the collection together as you can see below.

```javascript
import { startGraphQLServer } from 'meteor/quave:graphql';

import { createResolvers } from 'meteor/quave:resolvers';

import { DateTimeResolver } from 'meteor/quave:custom-type-date-time/DateTimeResolver';
import { DateTimeDefinition } from 'meteor/quave:custom-type-date-time/DateTimeDefinition';
import { PlayerPositionDefinition } from '../imports/players/PlayerPositionEnum';
import { PlayersCollection } from '../imports/players/PlayersCollection';
import { PlayerDefinition } from '../imports/players/PlayersDefinitions';

startGraphQLServer({
  typeDefs: [
    DateTimeDefinition,
    PlayerPositionDefinition.toGraphQL(),
    PlayerDefinition.toGraphQL(),
  ],
  resolvers: [
    DateTimeResolver,
    createResolvers({
      definition: PlayerDefinition,
      collection: PlayersCollection,
    }),
  ],
});

```

### License

MIT
