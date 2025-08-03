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
import { ITransactionTableRow, Transaction } from '../../models/Transaction';
import { format, parse } from 'date-fns';

type TransactionModalProps = {
  isOpen: boolean;
  mode?: 'create' | 'edit' | 'preview';
  transaction?: ITransactionTableRow | null;
  onClose: () => void;
  onCreate: (transaction: Transaction) => void;
};

export default function TransactionModal({ 
  isOpen,
  mode = 'create',
  transaction, 
  onClose,
  onCreate 
}: TransactionModalProps) {

  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');
  const [amountTouched, setAmountTouched] = useState(false);

  const [date, setDate] = useState<Date | null>(new Date());
  const [currency, setCurrency] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');

  const { user } = useUser();

  const [isCreateBtnDisabled, setIsCreateBtnDisabled] = useState(true);

  const modalTitle = {
    create: 'Create new transaction',
    preview: 'Preview transaction',
    edit: 'Edit transaction',
  };

  const buttonTitle = () => {
    if (mode === 'create') return 'Create';
    if (mode === 'edit') return 'Save';
    return '';
  };

  const createNewTransaction = () => {
    const newTransaction = {
      id: crypto.randomUUID(),
      userId: user?.id ?? 0,
      amount: Number(amount),
      currency: currency.toUpperCase(),
      category,
      date: date ? format(date, 'dd/MM/yyyy') : format(new Date(), 'dd/MM/yyyy'),
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

  useEffect(() => {
    if ((mode === 'preview' || mode === 'edit') && transaction) {
      setDate(parse(transaction.date, 'dd/MM/yyyy', new Date()));
      setAmount(transaction.amount.toString());
      setCurrency(transaction.currency);
      setCategory(transaction.category);
      setNote(transaction.note);
    } else {
      setDate(new Date());
      setAmount('');
      setCurrency('');
      setCategory('');
      setNote('');
    }
  }, [mode, transaction, isOpen]);

  return (  
    <Modal open={isOpen} onClose={onClose}>
      <div className='modal'>
        <h2 className='modal-title'>{modalTitle[mode]}</h2>
        <hr className="modal-divider" />

        <div>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
            <DatePicker
              sx={{ mb: 2, width: '100%' }}
              label="Date"
              disabled={mode === 'preview'}
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
              disabled={mode === 'preview'}
              error={amountTouched && !!amountError}
              helperText={amountTouched ? amountError : ''}
              onChange={(e) => setAmount(e.target.value)}
              onBlur={() => setAmountTouched(true)} 
            />

            <FormControl fullWidth>
              <InputLabel>Currency</InputLabel>
              <Select
                value={currency.toLowerCase()}
                label="Currency"
                disabled={mode === 'preview'}
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
              disabled={mode === 'preview'}
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
            disabled={mode === 'preview'}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <hr className="modal-divider" />

        <div className='modal-actions'>
          <Button onClick={cancelCreation}>Cancel</Button>
          { mode !== 'preview' && (
            <Button disabled={isCreateBtnDisabled} onClick={createNewTransaction}>{buttonTitle()}</Button>
          )}
        </div>
      </div>
    </Modal>
  )
}
