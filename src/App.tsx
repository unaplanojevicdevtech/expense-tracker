import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboards from './components/views/Dashboards';
import Transactions from './components/views/Transactions';
import Login from './components/views/Login';
import PrivateRoute from './routes/PrivateRoute';

// BrowserRouter - top-level wrapper that enables routing
// Routes - container that holds all your individual route definitions
// Route - defines a URL path and which component to render at that path
function App() {  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/home"
          element={
            <PrivateRoute>
              <Dashboards />
            </PrivateRoute>
          }
        />

        <Route
          path="/transactions"
          element={
            <PrivateRoute>
              <Transactions />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
export default App;
