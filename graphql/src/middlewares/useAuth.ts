import { AuthenticationError } from 'apollo-server-express';
import { MiddlewareFn } from 'type-graphql';
import { User } from '../entity/User';
import { MyContext } from '../types/MyContext';

export const useAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {
  const id = context.req.session.userId;
  if (!id) {
    throw new AuthenticationError('Invalid session');
  }

  const user = await User.findOne({ id });
  if (!user) {
    throw new AuthenticationError('Invalid session');
  }

  context.userId = id;

  return await next();
};
