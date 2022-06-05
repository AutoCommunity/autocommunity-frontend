import React from 'react';
import { Button } from 'react-bootstrap';

interface FormProps {
    onSubmit : any;
}

export const Form: React.FC<FormProps> = ({ onSubmit } : FormProps) => {
  return (
    <form onSubmit={onSubmit} style={{
      minWidth: "30%",
      maxWidth: "30%",
    }}>
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input className="form-control" id="name" />
      </div>
      <div className="form-group">
        <Button className="form-control btn btn-primary" type="submit">
          Submit
        </Button>
      </div>
    </form>
  );
};
export default Form;
