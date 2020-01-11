import { h } from "preact";
import { useState } from "preact/hooks";
import { memo } from "preact/compat";
import { MdClose } from "react-icons/md";
import { Toast, ToastBody, ToastHeader } from "reactstrap";

import style from "./style";

const ToastHelper = ({ toastId, data, deleteToast }) => {
  const handleClose = () => {
    deleteToast(toastId);
  };
  if (data.delay) {
    setTimeout(handleClose, data.delay);
  }
  return (
    <Toast key={toastId} isOpen={true} toggle={handleClose}>
      <ToastHeader>
        {data.header}
        <MdClose className={style.closeButton} onClick={handleClose} />
      </ToastHeader>
      <ToastBody>{data.body}</ToastBody>
    </Toast>
  );
};

export default memo(ToastHelper, (prevProps, nextProps) => {
  return prevProps.toastId === nextProps.toastId;
});
