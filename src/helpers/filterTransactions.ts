import { Transaction } from "../models/Transaction";

export function filterByUser(transaction: Transaction, userId?: number) {
  return transaction.userId === userId;
}

export function filterByCurrency(transaction: Transaction, currency: string) {
  return !currency || transaction.currency === currency;
}

export function filterByDate(transaction: Transaction, date: Date | null) {
  if (!date) return true;
  const txDate = new Date(transaction.date);
  return txDate >= date;
}

export function mapTransaction(transaction: Transaction): Transaction {
  return {
    ...transaction,
    note: transaction.note ? transaction.note : '-',
  };
}
