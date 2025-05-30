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

  const isFormInvalid = !name.trim() || !email.trim() || !username.trim() || !password.trim();

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

  const handleClose = () => {
    setName(user?.name || '');
    setEmail(user?.email || '');
    setUsername(user?.username || '');
    setPassword(user?.password || '');
    setIsDisabled(true);
    onClose();
  }

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
            {!name.trim() && !isDisabled && (
              <span className="user-modal-error">Name is required.</span>
            )}
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
            {!email.trim() && !isDisabled && (
              <span className="user-modal-error">Email is required.</span>
            )}

            {email.trim() && !isValidEmail(email) && !isDisabled && (
              <span className="user-modal-error">Invalid email format.</span>
            )}
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
            {!username.trim() && !isDisabled && (
              <span className="user-modal-error">Username is required.</span>
            )}
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
            {!password.trim() && !isDisabled && (
              <span className="user-modal-error">Password is required.</span>
            )}
          </div>
        </div>
        <hr className="user-modal-divider" />

        <div className="user-modal-actions">
          <Button onClick={handleClose} className="user-modal-close-btn">Cancel</Button>
          <Button onClick={handleChange} className="user-modal-edit-btn" disabled={isFormInvalid}>
            {isDisabled ? 'Edit' : 'Save'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}