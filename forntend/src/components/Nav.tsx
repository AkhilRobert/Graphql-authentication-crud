import { FC } from 'react';
import Button from 'react-bootstrap/Button';
import BootNav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

type Props = {
  user: string;
  logout: any;
};

export const Nav: FC<Props> = ({ user, logout }) => {
  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand>#Todo</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <BootNav className="mr-auto"></BootNav>
          <BootNav>
            <BootNav.Link>{user}</BootNav.Link>
            <Button variant="outline-danger" onClick={logout}>
              Logout
            </Button>
          </BootNav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};
