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
  TablePagination,
  Select
} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers';
import { enGB } from 'date-fns/locale';

import {
  filterByUser, 
  filterByCurrency, 
  filterByDate, 
  mapTransaction 
} from "../../helpers/filterTransactions";

function Transactions() {
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [transactionList, setTransactionList] = useState(transactions);
  const [transactionToDelete, setTransactionToDelete] = useState<Transaction | null>(null);

  const [currency, setCurrency] = useState('');
  const [date, setDate] = useState<Date | null>(null);

  const uniqueCurrencies = Array.from(
    new Set(transactionList.map(t => t.currency).filter(Boolean))
  );

  const tableHeaders: { label: string; key: keyof ITransactionTableRow }[] = [
    { label: 'Date', key: 'date' },
    { label: 'Category', key: 'category' },
    { label: 'Amount', key: 'amount' },
    { label: 'Currency', key: 'currency' },
  ];

  const tableRows: ITransactionTableRow[] = user
    ? transactionList
        .filter(tx => filterByUser(tx, user.id))
        .filter(tx => filterByCurrency(tx, currency))
        .filter(tx => filterByDate(tx, date))
        .map(mapTransaction)
    : [];

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [menuRowIndex, setMenuRowIndex] = useState<number | null>(null);
  const isMenuOpen = Boolean(menuAnchorEl);

  // maybe rename it to isModalOpen
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'preview'>('create');
  const [selectedTransaction, setSelectedTransaction] = useState<ITransactionTableRow | null>(null);

  const openModal = () => {
    setModalMode('create');
    setSelectedTransaction(null);
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

  const setModalData = (row: ITransactionTableRow) => {
    setSelectedTransaction(row);
    setIsModalOpen(true);
    handleMenuClose();
  };

  const handlePreviewModal = (row: ITransactionTableRow) => {
    setModalMode('preview');
    setModalData(row);
  };

  const handleEditModal = (row: ITransactionTableRow) => {
    setModalMode('edit');
    setModalData(row);
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
    setDate(null);
  };

  // pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const changePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedRows = tableRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <Header />
      <main className="transaction-page">
        <div className="transaction-page-body">
          <h1 className="transaction-page-title">Transactions</h1>
          <div className="transaction-header">
            <div className="transaction-filters">
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
                <DatePicker 
                  sx={{ width: '100%', background: '#fff'}}
                  label="From date"
                  disableFuture
                  value={date}
                  minDate={new Date('2010-01-01')}

                  onChange={setDate}
                />
              </LocalizationProvider>
              <FormControl fullWidth
              >
                <InputLabel id="currency-select-label">Currency</InputLabel>
                <Select
                  label="Currency"
                  variant="outlined"
                  sx={{ background: '#fff' }}
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <MenuItem key="all" value=""  disabled={currency === ''}>All</MenuItem>
                  {uniqueCurrencies.map(currency => (
                    <MenuItem key={currency} value={currency}>
                      {currency.toUpperCase()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="outlined"
                className="transaction-create-button"
                disabled={!currency && !date}
                onClick={clearFilters}
                sx={{
                  '&.Mui-disabled': {
                    color: '#aaa',
                    backgroundColor: '#f5f5f5',
                  }
                }}
              >
                Clear
              </Button>
            </div>
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
            rows={paginatedRows}
            renderActions={(row, rowIndex) => (
              <>
                <IconButton onClick={(e) => handleMenuOpen(e, rowIndex)}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={menuAnchorEl}
                  open={isMenuOpen && menuRowIndex === rowIndex}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={() => handleEditModal(row)}>
                    Edit
                  </MenuItem>
                  <MenuItem onClick={() => handleDeleteDialog(rowIndex)} style={{ color: 'red' }}>
                    Delete
                  </MenuItem>
                  <MenuItem onClick={() => handlePreviewModal(row)}>
                    Preview
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
          <TablePagination
            component="div"
            className="transaction-pagination"
            count={tableRows.length}
            page={page}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[5, 10, 15]}
            onPageChange={changePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>

        <TransactionModal
          isOpen={isModalOpen}
          mode={modalMode}
          transaction={selectedTransaction}
          onClose={closeModal}
          onCreate={handleCreateTransaction}  
        />
      </main>
    </>
  );
}

export default Transactions;
