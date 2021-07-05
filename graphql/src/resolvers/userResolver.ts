import { ApolloError, AuthenticationError } from 'apollo-server-express';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { LoginUser, RegisterUser, User } from '../entity/User';
import { MyContext } from '../types/MyContext';

@Resolver()
export class UserResolver {
  @Query(() => String)
  async me(@Ctx() { req }: MyContext) {
    const id = req.session.userId;
    const user = await User.findOne({ id });

    if (!user) {
      throw new AuthenticationError('Invalid session');
    }

    return user.username;
  }

  @Mutation(() => Boolean)
  async register(@Arg('data') { email, password, username }: RegisterUser): Promise<boolean> {
    const alreadyExist = await User.findOne({ email });

    if (alreadyExist) {
      throw new ApolloError('User with email alreay exists');
    }

    const user = User.create({ email, password, username });
    await user.save();
    return true;
  }

  @Mutation(() => User)
  async login(
    @Arg('data') { email, password }: LoginUser,
    @Ctx() { req }: MyContext
  ): Promise<User> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new AuthenticationError('Invalid email or password');
    }

    const valid = await user.isCorrectPassword(password);
    if (!valid) {
      throw new AuthenticationError('Invalid email or password');
    }

    req.session.userId = user.id;

    return user;
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext): boolean {
    req.session.destroy((err) => {
      console.log(err);
      res.clearCookie('sid');
      return false;
    });

    return true;
  }
}
