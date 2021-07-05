import React from 'react';
import ReactDOM from 'react-dom';
import { Routes } from './Routes';
import 'bootstrap/dist/css/bootstrap.min.css';
import { client } from './apollo';
import { ApolloProvider } from 'react-apollo';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <React.StrictMode>
        <Routes />
      </React.StrictMode>
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
