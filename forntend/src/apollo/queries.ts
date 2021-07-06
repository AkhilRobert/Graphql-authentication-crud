import { gql } from 'apollo-boost';

export const REGISTER = gql`
  mutation Register($email: String!, $password: String!, $username: String!) {
    register(data: { email: $email, password: $password, username: $username })
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(data: { email: $email, password: $password }) {
      id
      email
    }
  }
`;

export const ME = gql`
  query Me {
    me
  }
`;

export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

export const TODOS = gql`
  query Todos {
    todos {
      id
      title
      createdAt
      updatedAt
    }
  }
`;

export const DELETE = gql`
  mutation Delete($id: Float!) {
    deleteTodo(id: $id)
  }
`;

export const ADD_TODO = gql`
  mutation NewTodo($title: String!) {
    newTodo(data: { title: $title })
  }
`;

export const UPDATE_TODO = gql`
  mutation UpdateTodo($id: Float!, $title: String!) {
    updateTodo(data: { id: $id, title: $title })
  }
`;
