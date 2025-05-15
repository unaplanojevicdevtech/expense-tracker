import '../style/Header.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

function Header() {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const logout = () => {
    if (user) {
      setUser({ ...user, isAuthenticated: false });
      navigate('/');
    }
  };

  return (
    <header className="header">
      <div className="header-nav-wrapper">
        <div className="header-nav">
          <Link to="/home" className="header-nav-item">Home</Link>
          <Link to="/transactions" className="header-nav-item">Transactions</Link>
        </div>
      </div>
      <div>
        <button className="header-profile-btn" onClick={logout}>
          <AccountCircleIcon fontSize="large"/>
        </button>
      </div>
    </header>
  );
}

export default Header;
