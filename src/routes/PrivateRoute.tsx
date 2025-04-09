import { useUser } from '../context/UserContext';
import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

const PrivateRoute = ({ children }: Props) => {
  const { user } = useUser();

  if (!user?.isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
