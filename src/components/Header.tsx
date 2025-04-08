import '../style/Header.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header">
      <div className="header-nav-wrapper">
        <div className="header-nav">
          <Link to="/" className="header-nav-item">Home</Link>
          <Link to="/transactions" className="header-nav-item">Transactions</Link>
        </div>
      </div>
      <div>
        <button className="header-profile-btn">
          <AccountCircleIcon fontSize="large" />
        </button>
      </div>
    </header>
  );
}

export default Header;
