import React from "react";
import { Button } from "react-bootstrap";
function ErrorNotice(props) {
  return (
    <div className="error-notice">
      <span>{props.message}</span>
      <Button onClick={props.clearError}>X</Button>
    </div>
  );
}
export default ErrorNotice;
