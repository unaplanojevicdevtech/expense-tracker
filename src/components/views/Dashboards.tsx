import { useState } from "react";
import Header from "../Header";
import { PieChart } from '@mui/x-charts/PieChart';
import transactions from '../../data/transactions.json';

function Dashboards() {
  const [ transactionList ] = useState(transactions);

  const categoryCurrencyTotals: { [key: string]: { [currency: string]: number } } = {};
  for (const transaction of transactionList) {
    if (!categoryCurrencyTotals[transaction.category]) {
      categoryCurrencyTotals[transaction.category] = {};
    }
    categoryCurrencyTotals[transaction.category][transaction.currency] =
      (categoryCurrencyTotals[transaction.category][transaction.currency] || 0) + transaction.amount;
  }

  const pieData = [];
  let id = 0;
  for (const [category, currencyObj] of Object.entries(categoryCurrencyTotals)) {
    for (const [currency, value] of Object.entries(currencyObj)) {
      pieData.push({
        id: id++,
        value,
        label: `${category} (${currency})`,
      });
    }
  }

  return (
    <>
      <Header />
      <div>
        <main>
          <h1>Dashboards</h1>
          <div>
            <PieChart
              series={[
                {
                  data: [...pieData],
                  innerRadius: 20,
                  outerRadius: 100,
                  paddingAngle: 5,

                }
              ]}
              width={200}
              height={200}
            />
          </div>
        </main>
      </div>
    </>
  );
}
export default Dashboards;
