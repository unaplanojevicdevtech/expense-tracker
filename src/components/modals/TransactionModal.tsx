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
import { useState, useEffect, useRef } from 'react';
// TODO: api call or make it a constant, possibility to add new, need to think about it
import { categories } from '../../data/categories';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { enGB } from 'date-fns/locale';
import { useUser } from '../../context/UserContext';
import { Transaction } from '../../models/Transaction';
import { parse } from 'date-fns/parse';
import { format } from 'date-fns/format';

type TransactionModalProps = {
  isOpen: boolean;
  mode?: 'create' | 'edit' | 'preview';
  transaction?: Transaction | null;
  onClose: () => void;
  onCreate: (transaction: Transaction) => void;
  onEdit: (transaction: Transaction) => void;
};

export default function TransactionModal({ 
  isOpen,
  mode = 'create',
  transaction, 
  onClose,
  onCreate,
  onEdit
}: TransactionModalProps) {

  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState('');
  const [amountTouched, setAmountTouched] = useState(false);

  const [date, setDate] = useState<Date | null>(null);
  const [currency, setCurrency] = useState('');
  const [category, setCategory] = useState('');
  const [note, setNote] = useState('');

  const datePickerRef = useRef<HTMLInputElement>(null);
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  const { user } = useUser();

  const [isActionButtonDisabled, setIsActionButtonDisabled] = useState(true);

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
      date: date ? format(date, 'dd/MM/yyyy') : '',
      note,
    } as Transaction;

    onCreate(newTransaction); 
    resetForm();
    onClose();
  };

  const editTransaction = (transaction: Transaction) => {
    onEdit(transaction);
    resetForm();
    onClose();
  }

  const cancelCreation = () => {
    resetForm();
    onClose();
  };

  const resetForm = () => {
    resetDateField();
    resetAmountField();
    resetCategoryField();
    resetCurrencyField();
    setIsActionButtonDisabled(true);
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
    setDate(null);
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
    setIsActionButtonDisabled(!isFormValid);
  }, [currency, category, amount, amountTouched]);

  useEffect(() => {
    if ((mode === 'preview' || mode === 'edit') && transaction) {
      setIsActionButtonDisabled(true);

      const txDate = typeof transaction.date === 'string'
      ? parse(transaction.date, 'dd/MM/yyyy', new Date())
      : transaction.date;

      setDate(txDate);
      setAmount(transaction.amount.toString());
      setCurrency(transaction.currency);
      setCategory(transaction.category);
      setNote(transaction.note);
    } else {
      setDate(null);
      setAmount('');
      setCurrency('');
      setCategory('');
      setNote('');
    }
  }, [mode, transaction, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const id = setTimeout(() => {
      if (mode === 'preview') {
        cancelButtonRef.current?.focus();
      } else {
        datePickerRef.current?.focus();
      }
    }, 0);

    return () => clearTimeout(id);
  }, [isOpen, mode]);

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
    >
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
                  inputRef: datePickerRef,
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
          <Button ref={cancelButtonRef} onClick={cancelCreation}>Cancel</Button>
          { mode !== 'preview' && (
            <Button
              disabled={isActionButtonDisabled}
              onClick={mode === 'edit'
                ? () => {
                    if (transaction) {
                      editTransaction({
                        ...transaction,
                        amount: Number(amount),
                        currency: currency.toUpperCase(),
                        category,
                        date: date ?? new Date(),
                        note,
                        id: transaction.id,
                        userId: transaction.userId,
                      });
                    }
                  }
                : createNewTransaction}
            >
              {buttonTitle()}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}
