import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { buildSchema } from 'type-graphql';
import { createConnection, getConnection } from 'typeorm';
import session from 'express-session';
import { TypeormStore } from 'typeorm-store';
import { UserResolver } from './resolvers/userResolver';
import { Session } from './entity/Session';
import { MyContext } from './types/MyContext';

async function startServer() {
  const app = express();

  await createConnection();

  const repository = getConnection().getRepository(Session);

  app.use(
    session({
      name: 'sid',
      secret: 'This is a secret',
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
      },
      resave: false,
      saveUninitialized: false,
      store: new TypeormStore({ repository })
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver]
    }),
    context: ({ req, res }): MyContext => {
      return { req, res };
    }
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    cors: { credentials: true, origin: 'http://localhost:3000' }
  });

  app.listen(5000, () => {
    console.log('Server running at the port 5000');
  });
}

startServer().catch((err) => console.log(err));
