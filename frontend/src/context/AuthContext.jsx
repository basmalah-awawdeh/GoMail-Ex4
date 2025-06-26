import { createContext, useContext, useState } from 'react';
//creating new auth context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) =>{
  //loading token from local storage
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  //loading user ifno
  const [user, setUser] = useState(() =>{
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (newToken, userData) =>{
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(userData)); 
    //updating according to info above
    setToken(newToken);
    setUser(userData);
  };

  const logout = () =>{
    //removing stored toekn and user info
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    //reset
    setToken(null);
    setUser(null);
  };
  return(
    //provide all details to childen components
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
