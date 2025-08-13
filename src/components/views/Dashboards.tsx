import { useMemo, useState } from "react";
import { useUser } from "../../context/UserContext";
import Header from "../Header";
import transactions from '../../data/transactions.json';
import '../../style/Charts.css';
import '../../style/Dashboards.css';
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from '@mui/x-charts/PieChart';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";

function Dashboards() {
  const { user } = useUser();
  const [ transactionList ] = useState(transactions);

  // Filters
  const [currency, setCurrency] = useState('');
  const [minAmount, setMinAmount] = useState('');

  const uniqueCurrencies = useMemo(() => {
    return [...new Set(transactionList.map(t => t.currency).filter(Boolean))];
  }, [transactionList]);

  const filteredTransactions = useMemo(() => {
    return transactionList.filter(t => t.userId === user?.id && (!currency || t.currency === currency));
  }, [transactionList, user?.id, currency]);

  const clearFilters = () => {
    setCurrency('');
    setMinAmount('');
  };

  const filteredTransactionsForBar = useMemo(() => {
    return transactionList.filter(t => {
      const matchesUser = t.userId === user?.id;
      const matchesCurrency = !currency || t.currency === currency;
      const matchesMin = !minAmount || t.amount >= Number(minAmount);
      return matchesUser && matchesCurrency && matchesMin;
    });
  }, [transactionList, user?.id, currency, minAmount]);

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
    for (const [curr, totalValue] of Object.entries(currencyObj)) {
      const meetsAmount = minAmount ? totalValue >= Number(minAmount) : true;
      if (meetsAmount) {
        pieData.push({
          id: id++,
          value: totalValue,
          label: `${category} (${curr})`,
        });
      }
    }
  }

  // Data for BarChart
  // TODO: Do the logic on backend side
  const grouped: Record<string, Record<string, number>> = {};
  filteredTransactionsForBar.forEach(t => {
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
          <div className="dashboard-filters">
            <FormControl style={{ width: '200px' }}>
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

            <TextField
              label="Min amount"
              type="number"
              value={minAmount}
              disabled={!currency}
              sx={{ width: 200, background: '#fff' }}
              onChange={(e) => setMinAmount(e.target.value)}
            />

            <Button
              variant="outlined"
              className="dashboard-button"
              disabled={!currency}
              onClick={clearFilters}
              sx={{
                '&.Mui-disabled': {
                  color: '#aaa',
                  backgroundColor: '#f5f5f5',
                }
              }}
            >
              Clear
            </Button>
          </div>
          <div className="dashboard-charts">
            <div className="dashboard-chart-wrapper">
              <p className="dashboard-label">Amount by category</p>
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

            <div className="dashboard-chart-wrapper" style={{ marginTop: '2rem' }}>
              <p className="dashboard-label">Amount per category over time</p>
              <BarChart
                xAxis={[{ data: periods }]}
                series={series}
                height={300}
                sx={{
                  // X-axis labels
                  '.MuiChartsAxis-bottom .MuiChartsAxis-tickLabel': {
                    fill: '#000000',
                    fontWeight: 'bold',
                  },
                  // Y-axis labels
                  '.MuiChartsAxis-left .MuiChartsAxis-tickLabel': {
                    fill: '#000000',
                    fontWeight: 'bold',
                  },
                  //  axis lines
                  '.MuiChartsAxis-line': {
                    stroke: '#000000',
                  },
                }}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
export default Dashboards;
