import { h } from "preact";

import style from "./style";
import ToastHelper from "../toastHelper";

const ToastContainer = ({ toasts, deleteToast }) => {
  return (
    <div className={style.toastContainer}>
      {Object.entries(toasts).map(([key, toastData]) => (
        <ToastHelper
          key={key}
          toastId={key}
          data={toastData}
          deleteToast={deleteToast}
        />
      ))}
    </div>
  );
};

export default ToastContainer;
