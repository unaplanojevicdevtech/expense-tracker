import { TextField, Button } from "@mui/material";
import '../../style/Login.css';

import { useState } from "react";
import { useUser } from '../../context/UserContext';
import { useNavigate } from "react-router-dom";

import users from '../../data/users.json';
import { IUser } from '../../models/User';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const { setUser } = useUser();
  const navigate = useNavigate();

  const login = (() => {
    setUsernameError(false);
    setPasswordError(false);

    const foundUser = users.find(
      (u: IUser) => u.username === username && u.password === password
    );

    if (foundUser) {
      setUser({ ...foundUser, isAuthenticated: true });
      navigate('/home');
    } 
    else {
      if (!users.some((u: IUser) => u.username === username)) {
        setUsernameError(true);
      } else if (!users.some((u: IUser) => u.password === password)) {
        setPasswordError(true);
      }
    }
  });

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>Login</h1>
        <div className="login-form">
          <TextField
            label="Username"
            variant="standard"
            required
            fullWidth
            autoFocus
            error={usernameError}
            helperText={usernameError ? "Invalid username" : ""}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            variant="standard"
            required
            fullWidth
            error={passwordError}
            helperText={passwordError ? "Invalid password" : ""}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            variant="text"
            fullWidth
            onClick={login}
          > Login
          </Button>
        </div>
      </div>
    </div>
  );
}


export default Login;
