import { FC, useState } from 'react';
import { useMutation } from 'react-apollo';
import Button from 'react-bootstrap/Button';
import { DELETE as DELETE_TODO, TODOS } from '../apollo/queries';
import { UpdateModal } from './UpdateModal';

type Props = {
  title: string;
  id: number;
};

export const TodoItem: FC<Props> = ({ title, id }) => {
  const [deleteTodo] = useMutation(DELETE_TODO);
  const [showModal, setShowModal] = useState(false);

  const handleDelete = (id: number) => {
    deleteTodo({
      variables: { id },
      refetchQueries: [
        {
          query: TODOS
        }
      ]
    });
  };

  const handleUpdate = () => {
    setShowModal((show) => !show);
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <p className="m-0">{title}</p>
        <div className="d-flex" style={{ gap: '10px' }}>
          <Button variant="outline-primary" onClick={() => handleUpdate()}>
            Edit
          </Button>
          <Button variant="outline-danger" onClick={() => handleDelete(id)}>
            Delete
          </Button>
        </div>
      </div>
      {showModal && (
        <UpdateModal
          show={showModal}
          handleShow={() => setShowModal((show) => !show)}
          id={id}
          title={title}
        />
      )}
    </>
  );
};
