import { useLocation } from "react-router-dom";

const Modal = ({ isOpen, onClose, children }) => {
  const { pathname } = useLocation(); // get the current route

  if (!isOpen) return null;

  const showCloseButton = pathname !== "/account"; // hide close button only on /account

  return (
    <div className="modal modal-open fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="modal-box p-12 rounded-xl shadow-xl max-w-lg text-left mx-auto w-[88vw] sm:w-[90vw] lg:max-w-[1290px]">
        {children}
        {showCloseButton && (
          <div className="modal-action mt-4">
            <button className="btn" onClick={onClose}>
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal;
