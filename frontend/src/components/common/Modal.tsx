type ModalProps = {
  title: string;
  isOpen: boolean;
  onClose: () => void;
};

function Modal({
  title,
  isOpen,
  onClose
}: ModalProps) {

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">

        <h2>{title}</h2>

        <button onClick={onClose}>
          Close
        </button>

      </div>
    </div>
  );
}

export default Modal;