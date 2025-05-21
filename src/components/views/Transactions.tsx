import Header from "../Header";
import BasicTable from "../Table";
import transactions from '../../data/transactions.json';
import { ITransactionTableRow } from "../../models/Transaction";
import { useUser } from "../../context/UserContext";

function Transactions() {
  const { user } = useUser();

const tableHeaders: { label: string; key: keyof ITransactionTableRow }[] = [
    { label: 'Date', key: 'date' },
    { label: 'Description', key: 'description' },
    { label: 'Category', key: 'category' },
    { label: 'Amount', key: 'amount' },
  ];

  const tableRows: ITransactionTableRow[] = user
    ? transactions
        .filter(transaction => transaction.userId === user.id)
        .map(transaction => ({
          date: transaction.date,
          description: transaction.description,
          category: transaction.category,
          amount: `${transaction.amount} ${transaction.currency}`,
        }))
    : [];

  return (
    <> 
      <Header />
      <div>
        <h1>Transactions</h1>
        <BasicTable<ITransactionTableRow> headers={tableHeaders} rows={tableRows} />;
      </div>
    </>

  );
}
export default Transactions;
