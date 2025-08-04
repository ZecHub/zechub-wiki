import './modal.css';

type ModalProps = {
  children: React.ReactNode;
  isOpen: boolean;
  setIsOpen?: (arg: boolean) => void;
  handleOnClose?: () => void;
};

export function Modal(props: ModalProps) {
  return (
    <div style={{ display: !props.isOpen ? '' : 'block' }}>
      {props.isOpen && (
        <div
          id='genericModal'
          className='modal'
          style={props.isOpen && { display: 'block' }}
        >
          <div className='modal-content'>
            <span
              className='close'
              onClick={props.handleOnClose}
              title='Close Modal'
            >
              &times;
            </span>
            {props.children}
          </div>
        </div>
      )}
    </div>
  );
}
