export type Transaction = {
  id: string;
  userId: number;
  amount: number;
  currency: string;
  category: string;
  date: string;
  note: string;
};

export interface ITransactionTableRow {
  date: string;
  note: string;
  category: string;
  amount: number;
  currency: string;
}
