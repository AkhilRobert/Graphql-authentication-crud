import { useState } from 'react';
import { useMutation, useQuery } from 'react-apollo';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { Redirect, useHistory } from 'react-router-dom';
import { client } from '../apollo';
import { LOGOUT, ME, TODOS } from '../apollo/queries';
import { CenteredSpinner } from '../components/CenteredSpinner';
import { AddModal } from '../components/AddModal';
import { Nav } from '../components/Nav';
import { TodoItem } from '../components/TodoItem';

export const Home = () => {
  const history = useHistory();
  const [showModal, setShowModal] = useState(false);

  const { loading, data, error } = useQuery(ME);
  const { data: todoData, loading: todoLoading, error: TodoError } = useQuery(TODOS);
  const [logout] = useMutation(LOGOUT);

  const handleLogout = async () => {
    try {
      await logout();
      await client.clearStore();
      history.push('/login');
    } catch (err) {}
  };

  if (loading) {
    return (
      <div style={{ height: '100vh' }}>
        <CenteredSpinner />
      </div>
    );
  }

  if (error || TodoError) {
    return <Redirect to="/login" />;
  }

  return (
    <>
      <Nav user={data.me} logout={handleLogout} />
      <main className="container my-4">
        {todoLoading ? (
          <div style={{ height: '90vh' }}>
            <CenteredSpinner />
          </div>
        ) : todoData ? (
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-end">
                <Button variant="primary" onClick={() => setShowModal((show) => !show)}>
                  + Add
                </Button>
              </div>
            </Card.Header>
            {todoData.todos.map((todo: any) => (
              <ListGroup.Item key={todo.id}>
                <TodoItem title={todo.title} id={todo.id} />
              </ListGroup.Item>
            ))}
          </Card>
        ) : (
          <div style={{ height: '90vh' }}>
            <CenteredSpinner />
          </div>
        )}
        <AddModal show={showModal} handleShow={() => setShowModal((show) => !show)} />
      </main>
    </>
  );
};
