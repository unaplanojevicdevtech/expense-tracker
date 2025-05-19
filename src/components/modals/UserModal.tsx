import { Modal, Button } from '@mui/material';
import '../../style/UserModal.css';
import { useUser } from '../../context/UserContext';
import { useState } from 'react';

type UserModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function UserModal({ isOpen, onClose }: UserModalProps) {
  const { user, setUser } = useUser();

  const [isDisabled, setIsDisabled] = useState(true);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [username, setUsername] = useState(user?.username || '');
  const [password, setPassword] = useState(user?.password || '');

  const handleChange = () => {
    if (isDisabled) {
      // Enable editing
      setIsDisabled(false);
    } else {
      // Save changes
      setUser({
        ...user!,
        name,
        email,
        username,
        password,
      });

      setIsDisabled(true);
      onClose();
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="user-modal">
        <h2 className="user-modal-title">User Settings</h2>
        <hr className="user-modal-divider" />

        <div className="user-modal-content">
          <div className="user-modal-row">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              className="user-modal-input"
              placeholder="Enter your name"
              value={name}
              disabled={isDisabled}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="user-modal-row">
            <label htmlFor="email">Email</label>
            <input
              id="email" 
              type="email"
              disabled={isDisabled}
              className="user-modal-input"
              value={email}
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="user-modal-row">
            <label htmlFor="username">Username</label>
            <input
              id="username" 
              type="text" 
              className="user-modal-input" 
              placeholder="Enter your username"
              disabled={isDisabled}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="user-modal-row">
            <label htmlFor="password">Password</label>
            <input
              id="password" 
              type="password" 
              className="user-modal-input" 
              placeholder="Enter your password"
              disabled={isDisabled}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>
        <hr className="user-modal-divider" />

        <div className="user-modal-actions">
          <Button onClick={onClose} className="user-modal-close-btn">Cancel</Button>
          <Button onClick={handleChange} className="user-modal-edit-btn">
            {isDisabled ? 'Edit' : 'Save'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}