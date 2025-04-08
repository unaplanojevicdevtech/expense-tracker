import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header'
import Dashboards from './components/views/Dashboards';
import Transactions from './components/views/Transactions';

// BrowserRouter - top-level wrapper that enables routing
// Routes - container that holds all your individual route definitions
// Route - defines a URL path and which component to render at that path
function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Dashboards />} />
        <Route path="/transactions" element={<Transactions />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App;
