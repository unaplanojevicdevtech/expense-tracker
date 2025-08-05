export type Transaction = {
  id: string;
  userId: number;
  amount: number;
  currency: string;
  category: string;
  date: string | Date;
  note: string;
};
