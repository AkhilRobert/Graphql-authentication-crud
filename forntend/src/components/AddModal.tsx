import { FC } from 'react';
import { useMutation } from 'react-apollo';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import BootModal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { ADD_TODO, TODOS } from '../apollo/queries';

type Props = {
  show: boolean;
  handleShow: () => void;
  value?: string;
};

type MutationType = {
  todo: string;
};

export const AddModal: FC<Props> = ({ show, handleShow, value = '' }) => {
  const { control, handleSubmit, reset } = useForm({
    mode: 'onBlur'
  });

  const [addTodo, { loading }] = useMutation(ADD_TODO);

  const onSubmit: SubmitHandler<MutationType> = async ({ todo }) => {
    handleShow();
    await addTodo({
      variables: { title: todo },
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
        <BootModal.Title>Add Todo</BootModal.Title>
      </BootModal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <BootModal.Body>
          <Controller
            name="todo"
            control={control}
            defaultValue={value}
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
            {loading ? <Spinner animation="border" size="sm" role="status" /> : 'Submit'}
          </Button>
        </BootModal.Footer>
      </Form>
    </BootModal>
  );
};
