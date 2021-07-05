import { useMutation, useQuery } from 'react-apollo';
import { LOGOUT, ME } from '../apollo/queries';
import { Redirect, useHistory } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import { client } from '../apollo';

export const Home = () => {
  const history = useHistory();
  const { loading, data, error } = useQuery(ME);
  const [logout] = useMutation(LOGOUT);

  const handleLogout = async () => {
    try {
      await logout();
      await client.clearStore();
      history.push('/login');
    } catch (err) {
      console.log('Hello');
      console.error(err.message);
    }
  };

  if (loading && !data) {
    return <div>Loading</div>;
  }

  if (error) {
    return <Redirect to="/login" />;
  }

  console.log(data);

  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand>#Todo</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto"></Nav>
        <Nav>
          <Nav.Link>{data.me}</Nav.Link>
          <Button variant="outline-danger" onClick={handleLogout}>
            Logout
          </Button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};
