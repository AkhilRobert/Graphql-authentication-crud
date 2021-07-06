import { FC } from 'react';
import { useMutation } from 'react-apollo';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import BootModal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { TODOS, UPDATE_TODO } from '../apollo/queries';

type Props = {
  show: boolean;
  handleShow: () => void;
  id: number;
  title: string;
};

type MutationType = {
  todo: string;
};

export const UpdateModal: FC<Props> = ({ show, handleShow, id, title }) => {
  const { control, handleSubmit, reset } = useForm({
    mode: 'onBlur'
  });

  const [updateTodo, { loading }] = useMutation(UPDATE_TODO);

  const onSubmit: SubmitHandler<MutationType> = async ({ todo }) => {
    handleShow();
    await updateTodo({
      variables: { title: todo, id },
      refetchQueries: [
        {
          query: TODOS
        }
      ]
    });
    reset({
      todo: ''
    });
  };

  return (
    <BootModal
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={show}
      onHide={() => handleShow()}
    >
      <BootModal.Header closeButton>
        <BootModal.Title>Update Todo</BootModal.Title>
      </BootModal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <BootModal.Body>
          <Controller
            name="todo"
            control={control}
            defaultValue={title}
            rules={{
              required: {
                value: true,
                message: 'Todo is required'
              }
            }}
            render={({ field, fieldState, formState }) => (
              <Form.Group>
                <Form.Label>Todo</Form.Label>
                <Form.Control {...field} placeholder="Enter Todo" isInvalid={!!fieldState.error} />
                {fieldState.error && (
                  <Form.Control.Feedback type="invalid">
                    {fieldState.error.message}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            )}
          />
        </BootModal.Body>
        <BootModal.Footer>
          <Button variant="primary" type="submit" style={{ width: '100px' }}>
            {loading ? <Spinner animation="border" size="sm" role="status" /> : 'Update'}
          </Button>
        </BootModal.Footer>
      </Form>
    </BootModal>
  );
};
