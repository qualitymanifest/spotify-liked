import { h } from "preact";
import { useState } from "preact/hooks";
import { memo } from "preact/compat";
import { Toast } from "react-bootstrap";

const ToastHelper = ({ toastId, data, deleteToast }) => {
  const handleClose = () => {
    deleteToast(toastId);
  };
  return (
    <Toast
      key={toastId}
      show={true}
      onClose={handleClose}
      delay={data.delay}
      autohide={Boolean(data.delay)}
      animation={false}
    >
      <Toast.Header>{data.header}</Toast.Header>
      <Toast.Body>{data.body}</Toast.Body>
    </Toast>
  );
};

export default memo(ToastHelper, (prevProps, nextProps) => {
  return prevProps.toastId === nextProps.toastId;
});
