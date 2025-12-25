import {
  Dialog, 
  DialogContent, 
  DialogTitle, 
  DialogContentText, 
  DialogActions, 
  Button 
} from "@mui/material";

interface DeleteTransactionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export function DeleteTransactionDialog({ isOpen, onClose, onDelete }: DeleteTransactionDialogProps) {
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>Delete transaction</DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure you want to delete this transaction? This action cannot be undone.</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} autoFocus>Cancel</Button>
        <Button onClick={onDelete}>Delete</Button>   
      </DialogActions>
    </Dialog>
  );
}
