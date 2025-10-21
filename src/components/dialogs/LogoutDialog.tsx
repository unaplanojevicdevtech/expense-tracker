import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useRef } from 'react';

interface LogoutDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export function LogoutDialog({ isOpen, onClose, onLogout }: LogoutDialogProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      TransitionProps={{
        onEntered: () => {
          cancelButtonRef.current?.focus();
        },
      }}
    >
      <DialogTitle>Logout</DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure you want to log out? Any unsaved changes will be lost.</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button ref={cancelButtonRef} onClick={onClose} autoFocus>Cancel</Button>
        <Button onClick={onLogout}>Logout</Button>
      </DialogActions>
    </Dialog>
  );
}
