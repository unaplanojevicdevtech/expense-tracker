import Header from "../Header";
import BasicTable from "../Table";
import TransactionModal from "../modals/TransactionModal";
import transactions from '../../data/transactions.json';
import { useState } from "react";
import { ITransactionTableRow, Transaction } from "../../models/Transaction";
import { useUser } from "../../context/UserContext";
import '../../style/Transactions.css';
import { 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogContentText, 
  DialogTitle, 
  FormControl, 
  IconButton, 
  InputLabel, 
  Menu, 
  MenuItem,
  Select
} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { format } from 'date-fns';

function Transactions() {
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [transactionList, setTransactionList] = useState(transactions);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);

  const [currency, setCurrency] = useState('');

  const uniqueCurrencies = Array.from(
    new Set(transactionList.map(t => t.currency).filter(Boolean))
  );

  const tableHeaders: { label: string; key: keyof ITransactionTableRow }[] = [
    { label: 'Date', key: 'date' },
    { label: 'Note', key: 'note' },
    { label: 'Category', key: 'category' },
    { label: 'Amount', key: 'amount' },
    { label: 'Currency', key: 'currency' },
  ];

  const tableRows: ITransactionTableRow[] = user
    ? transactionList
        .filter(transaction => transaction.userId === user.id)
        .filter(transaction => !currency || transaction.currency === currency) // <-- add this line
        .map(transaction => ({
          ...transaction,
          date: format(new Date(transaction.date), 'dd/MM/yyyy'),
          note: transaction.note ? transaction.note : '-',
        }))
    : [];

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [menuRowIndex, setMenuRowIndex] = useState<number | null>(null);
  const isMenuOpen = Boolean(menuAnchorEl);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateTransaction = (newTransaction: Transaction) => {
    setTransactionList(currentTransactions => [...currentTransactions, newTransaction]);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, rowIndex: number) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuRowIndex(rowIndex);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuRowIndex(null);
  };

  const deleteTransaction = () => {
    if (transactionToDelete) {
      setTransactionList(currentTransactions =>
        currentTransactions.filter(t => t.id !== transactionToDelete.id)
      );
      setIsDialogOpen(false);
      setTransactionToDelete(null);
    }
  };

  const handleDeleteDialog = (rowIndex: number) => {
    const transactionsByUser = transactionList.filter(t => t.userId === user?.id);
    const transaction = transactionsByUser[rowIndex];
    setTransactionToDelete(transaction);
    setIsDialogOpen(true);
    handleMenuClose();
  };

  const clearFilters = () => {
    setCurrency('');
    // Reset other filters if any
  };

  return (
    <>
      <Header />
      <main className="transaction-page">
        <div className="transaction-page-body">
          <h1 className="transaction-page-title">Transactions</h1>
          <div className="transaction-header">
            <div className="transaction-filters">
              <FormControl fullWidth
              >
                <InputLabel id="currency-select-label">Currency</InputLabel>
                <Select
                  value={currency}
                  label="Currency"
                  variant="outlined"
                  sx={{ background: '#fff' }}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  {uniqueCurrencies.map(currency => (
                    <MenuItem key={currency} value={currency}>
                      {currency.toUpperCase()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* Future filter inputs go here */}
            </div>
            <Button
              variant="outlined"
              className="transaction-create-button"
              onClick={clearFilters}
            >
              Clear
            </Button>
            <Button
              variant="outlined"
              className="transaction-create-button"
              onClick={openModal}
            >
              Create new transaction
            </Button>
          </div>
          <BasicTable<ITransactionTableRow>
            headers={tableHeaders}
            rows={tableRows}
            renderActions={(_, rowIndex) => (
              <>
                <IconButton onClick={(e) => handleMenuOpen(e, rowIndex)}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={menuAnchorEl}
                  open={isMenuOpen && menuRowIndex === rowIndex}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={() => { console.log(`Edit row ${rowIndex}`); handleMenuClose(); }}>
                    Edit
                  </MenuItem>
                  <MenuItem onClick={() => handleDeleteDialog(rowIndex)} style={{ color: 'red' }}>
                    Delete
                  </MenuItem>
                  <MenuItem onClick={() => { console.log(`View details for row ${rowIndex}`); handleMenuClose(); }}>
                    View Details
                  </MenuItem>
                </Menu>
                <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                  <DialogTitle>Delete transaction</DialogTitle>
                  <DialogContent>
                    <DialogContentText>Are you sure you want to delete this transaction? This action cannot be undone.</DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button onClick={deleteTransaction}>Delete</Button>   
                  </DialogActions>
                </Dialog>
              </>
            )}
          />
        </div>

        <TransactionModal
          isOpen={isModalOpen} 
          onClose={closeModal}
          onCreate={handleCreateTransaction}  
        />
      </main>
    </>
  );
}

export default Transactions;
