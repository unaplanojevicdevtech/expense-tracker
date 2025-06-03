import {
  Modal,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField
} from '@mui/material';
import '../../style/Modal.css';
import '../../style/TransactionModal.css';
import { useState, useEffect } from 'react';
// TODO: api call or make it a constant, possibility to add new, need to think about it
import { categories } from '../../data/categories';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { enGB } from 'date-fns/locale';
import { useUser } from '../../context/UserContext';
import { Transaction } from '../../models/Transaction';

type TransactionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (transaction: Transaction) => void;
};

export default function TransactionModal({ isOpen, onClose, onCreate }: TransactionModalProps) {
  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');
  const [amountTouched, setAmountTouched] = useState(false);

  const [date, setDate] = useState<Date | null>(new Date());
  const [currency, setCurrency] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');

  const { user } = useUser();

  const [isCreateBtnDisabled, setIsCreateBtnDisabled] = useState(true);

  const createNewTransaction = () => {
    const newTransaction = {
      id: crypto.randomUUID(),
      userId: user?.id ?? 0,
      amount: Number(amount),
      currency,
      category,
      date: (date ?? new Date()).toISOString().split('T')[0],
      note,
    };

    onCreate(newTransaction); 
    resetForm();
    onClose();
  };

  const cancelCreation = () => {
    resetForm();
    onClose();
  };

  const resetForm = () => {
    resetDateField();
    resetAmountField();
    resetCategoryField();
    resetCurrencyField();
    setIsCreateBtnDisabled(true);
  };

  const resetAmountField = () => {
    setAmount('');
    setAmountTouched(false);
    setAmountError('');
  };

  const resetCategoryField = () => {
    setCategory('');
  };

  const resetCurrencyField = () => {
    setCurrency('');
  };

  const resetDateField = () => {
    setDate(new Date());
  }

  useEffect(() => {
    let amountErr = '';
    if (amountTouched) {
      if (!amount) {
        amountErr = 'Amount is required';
      }
    }
    setAmountError(amountErr);

    const isFormValid = currency !== '' && category !== '' && !amountErr;
    setIsCreateBtnDisabled(!isFormValid);
  }, [currency, category, amount, amountTouched]);

  return (  
    <Modal open={isOpen} onClose={onClose}>
      <div className='modal'>
        <h2 className='modal-title'>Create new transaction</h2>
        <hr className="modal-divider" />

        <div>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
            <DatePicker
              sx={{ mb: 2, width: '100%' }}
              label="Date"
              disableFuture
              minDate={new Date('2010-01-01')}
              value={date}
              onChange={(newDate) => setDate(newDate)}
              slotProps={{
                textField: {
                  inputProps: { readOnly: true }
                }
              }}
            />
          </LocalizationProvider>

          <div className='transaction-amount-wrapper'>
            <TextField
              fullWidth
              sx={{ mb: 2 }}
              label="Amount"
              type="number"
              value={amount}
              error={amountTouched && !!amountError}
              helperText={amountTouched ? amountError : ''}
              onChange={(e) => setAmount(e.target.value)}
              onBlur={() => setAmountTouched(true)} 
            />

            <FormControl fullWidth>
              <InputLabel>Currency</InputLabel>
              <Select
                value={currency}
                label="Currency"
                onChange={(e) => setCurrency(e.target.value)}
              >
                <MenuItem value={'eur'}>EUR</MenuItem>
                <MenuItem value={'usd'}>USD</MenuItem>
                <MenuItem value={'rsd'}>RSD</MenuItem>
              </Select>
            </FormControl>
          </div>

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            minRows={4}
            maxRows={4}
            label="Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <hr className="modal-divider" />

        <div className='modal-actions'>
          <Button onClick={cancelCreation}>Cancel</Button>
          <Button disabled={isCreateBtnDisabled} onClick={createNewTransaction}>Create</Button>
        </div>
      </div>
    </Modal>
  )
}
