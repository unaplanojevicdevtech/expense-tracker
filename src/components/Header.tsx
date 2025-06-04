import '../style/Header.css';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Menu,
  MenuItem
} from '@mui/material';
import UserModal from './modals/UserModal';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useState } from 'react';

function Header() {
  // dropdown menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isMenuOpen = Boolean(anchorEl);

  const openMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const closeMenu = () => {
    setAnchorEl(null);
  };

  // logout
  const [ isDialogOpen, setIsDialogOpen ] = useState(false);
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const openLogoutDialog = () => {
    setIsDialogOpen(true);
    closeMenu();
  };

  const closeLogoutDialog = () => {
    setIsDialogOpen(false);
  };

  const logout = () => {
    if (user) {
      setUser({ ...user, isAuthenticated: false });
      navigate('/');
    }
    closeLogoutDialog();
  };

  // settings
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const openSettings = () => {
    setIsSettingsOpen(true);
    closeMenu();
  };

  const closeSettings = () => {
    setIsSettingsOpen(false);
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
        <Button
          onClick={openMenu}
          className="header-profile-btn"
        >
          <AccountCircleIcon fontSize="large"/>
        </Button>
        <Menu 
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={closeMenu}
        >
          <MenuItem onClick={openSettings}>Settings</MenuItem>
          <MenuItem onClick={openLogoutDialog}>Logout</MenuItem>
        </Menu>
        <Dialog open={isDialogOpen} onClose={closeLogoutDialog}>
          <DialogTitle>Logout</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to log out? Any unsaved changes will be lost.</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeLogoutDialog}>Cancel</Button>
            <Button onClick={logout}>Logout</Button>
          </DialogActions>
        </Dialog>
        <UserModal isOpen={isSettingsOpen} onClose={closeSettings} />
      </div>
    </header>
  );
}

export default Header;
