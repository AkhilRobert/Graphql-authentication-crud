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
