import { Modal, Button, TextField, Fade } from '@mui/material';
import '../../style/Modal.css';
import '../../style/UserModal.css';
import { useUser } from '../../context/UserContext';
import { useEffect, useRef, useState } from 'react';

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

  const editButtonRef = useRef<HTMLButtonElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

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
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isFormInvalid = !name.trim() || !email.trim() || !username.trim() || !password.trim() || !isValidEmail(email);

  useEffect(() => {
  if (!isDisabled) {
    // focus first input once editing starts
    nameInputRef.current?.focus();
  }
}, [isDisabled]);

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      closeAfterTransition
      >
      <Fade
        in={isOpen}
        onEntered={() => {
          if (isDisabled) {
            editButtonRef.current?.focus();
          }
        }}
      >
        <div className="modal">
          <h2 className="modal-title">User Settings</h2>
          <hr className="modal-divider" />

          <div className="user-modal-content">
            <div className="user-modal-row">
              <TextField
                fullWidth
                sx={{ mb: 2 }}
                label="Name"
                disabled={isDisabled}
                inputRef={nameInputRef}
                autoFocus={!isDisabled}
                error={!name.trim() && !isDisabled}
                helperText={!name.trim() && !isDisabled ? "Name is required." : ""}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="user-modal-row">
              <TextField
                fullWidth
                sx={{ mb: 2 }}
                label="Email"
                type="email"
                disabled={isDisabled}
                error={
                  (!isDisabled && (!email.trim() || (!!email.trim() && !isValidEmail(email))))
                }
                helperText={
                  !email.trim() && !isDisabled
                    ? "Email is required."
                    : email.trim() && !isValidEmail(email) && !isDisabled
                    ? "Invalid email format."
                    : ""
                }
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="user-modal-row">
              <TextField 
                fullWidth
                sx={{ mb: 2 }}
                label="Username"
                type="text"
                disabled={isDisabled}
                error={!username.trim() && !isDisabled}
                helperText={!username.trim() && !isDisabled ? "Username is required." : ""}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="user-modal-row">
              <TextField 
                fullWidth
                sx={{ mb: 2 }}
                label="Password"
                type="password"
                disabled={isDisabled}
                error={!password.trim() && !isDisabled}
                helperText={!password.trim() && !isDisabled ? "Password is required." : ""}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <hr className="modal-divider" />

          <div className="modal-actions">
            <Button onClick={handleClose} className="user-modal-close-btn">Cancel</Button>
            <Button
              onClick={handleChange}
              className="user-modal-edit-btn"
              ref={editButtonRef}
              autoFocus={isDisabled}
              disabled={isFormInvalid}
            >
              {isDisabled ? 'Edit' : 'Save'}
            </Button>
          </div>
        </div>
      </Fade>
    </Modal>
  );
}