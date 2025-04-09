import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboards from './components/views/Dashboards';
import Login from './components/views/Login';
import { useUser } from './context/UserContext';

// BrowserRouter - top-level wrapper that enables routing
// Routes - container that holds all your individual route definitions
// Route - defines a URL path and which component to render at that path
function App() {
  const { user } = useUser();
  
  return (
    <BrowserRouter>
      {user?.isAuthenticated && <Dashboards />}
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App;
