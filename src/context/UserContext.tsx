import { createContext, ReactNode, useContext, useState } from 'react';
import { IUser } from '../models/User';

type UserContextType = {
  user: IUser | null;
  setUser: (user: IUser | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};

export default UserContext;


