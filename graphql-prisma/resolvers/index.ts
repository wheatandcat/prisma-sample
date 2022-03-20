import { Resolvers } from '../types/generated/graphql';
import * as mutaiton from './mutation/';
import { dateScalar } from './scalar/date';

const resolvers: Resolvers = {
  Query: {
    getUser: () => null,
    getTodos: () => [],
    getTodoById: () => null,
  },
  Mutation: mutaiton,
  Date: dateScalar,
};

export default resolvers;
