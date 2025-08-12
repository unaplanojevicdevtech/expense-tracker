import { useState } from "react";
import { useUser } from "../../context/UserContext";
import Header from "../Header";
import transactions from '../../data/transactions.json';
import '../../style/Charts.css';
import '../../style/Dashboards.css';
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from '@mui/x-charts/PieChart';
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

function Dashboards() {
  const { user } = useUser();
  const [ transactionList ] = useState(transactions);

  // Filters
  const [currency, setCurrency] = useState('');

  const uniqueCurrencies = Array.from(
    new Set(transactionList.map(t => t.currency).filter(Boolean))
  );

  const filteredTransactions = transactionList.filter(t => 
    t.userId === user?.id && (!currency || t.currency === currency)
  );

  // Data for PieChart
  // TODO: Do the logic on backend side 
  const categoryCurrencyTotals: Record<string, Record<string, number>> = {};
  filteredTransactions.forEach(t => {
    if (!categoryCurrencyTotals[t.category]) {
      categoryCurrencyTotals[t.category] = {};
    }
    categoryCurrencyTotals[t.category][t.currency] =
      (categoryCurrencyTotals[t.category][t.currency] || 0) + t.amount;
  });

  const pieData = [];
  let id = 0;
  for (const [category, currencyObj] of Object.entries(categoryCurrencyTotals)) {
    for (const [curr, value] of Object.entries(currencyObj)) {
      if (!currency || curr === currency) {
        pieData.push({
          id: id++,
          value,
          label: `${category} (${curr})`,
        });
      }
    }
  }

  // Data for BarChart
  // TODO: Do the logic on backend side
  const grouped: Record<string, Record<string, number>> = {};
  filteredTransactions.forEach(t => {
    const [, month, year] = t.date.split("/");
    const period = `${month}/${year}`;

    if (!grouped[period]) grouped[period] = {};

    if (!grouped[period][t.category]) grouped[period][t.category] = 0;

    grouped[period][t.category] += t.amount;
  });


  // Sort periods chronologically
  const periods = Object.keys(grouped).sort((a, b) => {
    const [am, ay] = a.split("/").map(Number);
    const [bm, by] = b.split("/").map(Number);
    return ay - by || am - bm; // sort by year, then month
  });

  // Get unique categories
  const categories = new Set<string>();
  Object.values(grouped).forEach((categoryObj) =>
    Object.keys(categoryObj).forEach((category) => categories.add(category))
  );

  // Build series for BarChart
  const series = Array.from(categories).map((category) => ({
    label: category,
    data: periods.map((p) => grouped[p][category] || 0),
  }));

  return (
    <>
      <Header />
      <div className="dashboard-page">
        <main className="dashboard-page-body">
          <h1 className="dashboard-page-title">Dashboards</h1>
          <div>
            <FormControl fullWidth>
              <InputLabel id="currency-select-label">Currency</InputLabel>
              <Select
                label="Currency"
                variant="outlined"
                sx={{ background: '#fff' }}
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                <MenuItem key="all" value=""  disabled={currency === ''}>All</MenuItem>
                {uniqueCurrencies.map((curr) => (
                  <MenuItem key={curr} value={curr}>
                    {curr.toUpperCase()}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="dashboard-charts">
            <div>
              <p>Amount by category</p>
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

            <div style={{ marginTop: '2rem' }}>
              <p>Amount per category over time</p>
              <BarChart
                xAxis={[{ data: periods }]}
                series={series}
                height={300}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
export default Dashboards;
