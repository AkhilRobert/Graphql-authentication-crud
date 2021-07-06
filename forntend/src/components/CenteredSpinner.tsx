import Spinner from 'react-bootstrap/Spinner';

export const CenteredSpinner = () => {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100%' }}>
      <Spinner animation="border" />
    </div>
  );
};
