import { Modal, Button } from '@mui/material';

type UserModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function UserModal({ isOpen, onClose }: UserModalProps) {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'white',
        padding: '2rem',
        borderRadius: '8px',
        outline: 'none',
        minWidth: '300px'
      }}>
        <h2>Settings</h2>
        {/* You can pass children here or props if you want it dynamic */}
        <Button onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
}
