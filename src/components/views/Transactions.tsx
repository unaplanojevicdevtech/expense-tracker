import Header from "../Header";
import BasicTable from "../Table";
import TransactionModal from "../modals/TransactionModal";
import transactions from '../../data/transactions.json';
import { useState } from "react";
import { ITransactionTableRow, Transaction } from "../../models/Transaction";
import { useUser } from "../../context/UserContext";
import '../../style/Transactions.css';
import { Button, IconButton, Menu, MenuItem } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { format } from 'date-fns';

function Transactions() {
  const { user } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionList, setTransactionList] = useState(transactions);

  const tableHeaders: { label: string; key: keyof ITransactionTableRow }[] = [
    { label: 'Date', key: 'date' },
    { label: 'Note', key: 'note' },
    { label: 'Category', key: 'category' },
    { label: 'Amount', key: 'amount' }
  ];

  const tableRows: ITransactionTableRow[] = user
    ? transactionList
        .filter(transaction => transaction.userId === user.id)
        .map(transaction => ({
          date: format(new Date(transaction.date), 'dd/MM/yyyy'),
          note: transaction.note ? transaction.note : '-',
          category: transaction.category,
          amount: `${transaction.amount} ${transaction.currency}`,
        }))
    : [];

  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [menuRowIndex, setMenuRowIndex] = useState<number | null>(null);
  const isMenuOpen = Boolean(menuAnchorEl);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleCreateTransaction = (newTransaction: Transaction) => {
    setTransactionList(prev => [...prev, newTransaction]);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>, rowIndex: number) => {
    setMenuAnchorEl(event.currentTarget);
    setMenuRowIndex(rowIndex);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setMenuRowIndex(null);
  };

  return (
    <>
      <Header />
      <main className="transaction-page">
        <div className="transaction-page-body">
          <h1 className="transaction-page-title">Transactions</h1>
          <div className="transaction-header">
            <div className="transaction-filters">
              {/* Future filter inputs go here */}
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
                  <MenuItem onClick={() => { console.log(`Delete row ${rowIndex}`); handleMenuClose(); }}>
                    Delete
                  </MenuItem>
                  <MenuItem onClick={() => { console.log(`View details for row ${rowIndex}`); handleMenuClose(); }}>
                    View Details
                  </MenuItem>
                </Menu>
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
