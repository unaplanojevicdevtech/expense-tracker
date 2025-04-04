import '../style/Header.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function Header() {
  return (
    <header className="header">
      <div className="header-nav-wrapper">
        <div className="header-nav">
          <button className="header-nav-item">Home</button>
          <button className="header-nav-item">Transactions</button>
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
