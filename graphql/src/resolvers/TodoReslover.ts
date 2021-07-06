import { ForbiddenError, UserInputError } from 'apollo-server-express';
import { Arg, Ctx, Mutation, Query, Resolver, UseMiddleware } from 'type-graphql';
import { getConnection } from 'typeorm';
import { Todo, TodoInput } from '../entity/Todo';
import { User } from '../entity/User';
import { useAuth } from '../middlewares/useAuth';
import { MyContext } from '../types/MyContext';

@Resolver()
export class TodoResolver {
  @Query(() => [Todo])
  @UseMiddleware(useAuth)
  async todos(@Ctx() { userId }: MyContext): Promise<Todo[]> {
    const user = await getConnection()
      .getRepository(User)
      .createQueryBuilder('user')
      .where('user.id = :id', { id: userId })
      .leftJoinAndSelect('user.todos', 'todo')
      .getOne();

    return user!.todos;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(useAuth)
  async newTodo(@Arg('data') { title }: TodoInput, @Ctx() { userId }: MyContext): Promise<boolean> {
    const todo = Todo.create({ title });
    await todo.save();

    const user = await getConnection()
      .getRepository(User)
      .createQueryBuilder('user')
      .where('user.id = :id', { id: userId })
      .leftJoinAndSelect('user.todos', 'todo')
      .getOne();

    user!.todos = [...user!.todos, todo];
    user!.save();

    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(useAuth)
  async deleteTodo(@Arg('id') id: number, @Ctx() { userId }: MyContext): Promise<boolean> {
    const todo = await getConnection()
      .getRepository(Todo)
      .createQueryBuilder('todos')
      .where('todos.id = :id', { id: id })
      .leftJoinAndSelect('todos.user', 'user')
      .getOne();

    if (!todo) {
      throw new UserInputError('Invalid id');
    }

    console.log(userId);

    if (todo?.user.id !== userId) {
      throw new ForbiddenError('Not allowed');
    }

    console.log(todo);

    await todo?.remove();

    return true;
  }

  @Mutation(() => Boolean)
  @UseMiddleware(useAuth)
  async updateTodo(@Arg('data') { id, title }: TodoInput, @Ctx() { userId }: MyContext) {
    if (!id) {
      throw new UserInputError('Please provide an id');
    }

    const todo = await getConnection()
      .getRepository(Todo)
      .createQueryBuilder('todos')
      .where('todos.id = :id', { id: id })
      .leftJoinAndSelect('todos.user', 'user')
      .getOne();

    if (!todo) {
      throw new UserInputError('Invalid id');
    }

    if (todo?.user.id !== userId) {
      throw new ForbiddenError('Not allowed');
    }

    todo.title = title || todo.title;

    await todo.save();

    return true;
  }
}
