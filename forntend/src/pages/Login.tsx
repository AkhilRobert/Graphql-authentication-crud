import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import Spinner from 'react-bootstrap/Spinner';
import { useMutation } from 'react-apollo';
import { Link, useHistory } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import { LOGIN } from '../apollo/queries';

type InputValues = {
  email: string;
  password: string;
};

export const Login = () => {
  const history = useHistory();

  const { control, handleSubmit } = useForm<InputValues>({
    mode: 'onBlur'
  });

  const [login, { loading, error }] = useMutation(LOGIN, {
    fetchPolicy: 'no-cache',
    onCompleted: () => {
      history.push('/');
    }
  });

  const onSubmit: SubmitHandler<InputValues> = async ({ email, password }) => {
    try {
      await login({ variables: { email, password }, fetchPolicy: 'no-cache' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ minHeight: '100vh', maxWidth: '720px' }}
    >
      <div className="w-100">
        <h1 className="text-center">Login</h1>
        <Form onSubmit={handleSubmit(onSubmit)} className="mt-4">
          {/* email */}
          <Controller
            name="email"
            control={control}
            defaultValue=""
            rules={{
              required: {
                value: true,
                message: 'Email is required'
              },
              pattern: {
                value:
                  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: 'Not a valid email'
              }
            }}
            render={({ field, fieldState }) => (
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  {...field}
                  type="email"
                  placeholder="Enter email"
                  isInvalid={!!fieldState.error}
                />
                {fieldState.error && (
                  <Form.Control.Feedback type="invalid">
                    {fieldState.error.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            )}
          />

          {/* password */}
          <Controller
            name="password"
            control={control}
            defaultValue=""
            rules={{
              required: {
                value: true,
                message: 'password is required'
              }
            }}
            render={({ field, fieldState }) => (
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  {...field}
                  type="password"
                  placeholder="Enter password"
                  isInvalid={!!fieldState.error}
                />
                {fieldState.error && (
                  <Form.Control.Feedback type="invalid">
                    {fieldState.error.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            )}
          />
          {error && <Alert variant="danger">{error.message.replace('GraphQL error: ', '')}</Alert>}
          <Button variant="primary" type="submit" style={{ width: '100px' }}>
            {loading ? <Spinner animation="border" size="sm" role="status" /> : 'Submit'}
          </Button>
          <Form.Text id="passwordHelpBlock" className="mt-4">
            Don't have an account? <Link to="/register">Register Now</Link>
          </Form.Text>
        </Form>
      </div>
    </div>
  );
};
