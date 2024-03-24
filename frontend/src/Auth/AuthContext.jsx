import React, { createContext, useState, useContext, useEffect } from 'react';


const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);



export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedCar,setSelectedCar] = useState({})
  const logout = () => {
    localStorage.removeItem('access_token')
    setIsAuthenticated(false)

  };
  // const checkToken = () => {
  //   token = localStorage.getItem('access_token')
  //   if token
  // }

//   useEffect(() => {
//     const token = localStorage.getItem('access_token');
//     if (token) {
//         console.log('hhhhhh');
//       setIsAuthenticated(true);
//     }
//   }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated,setIsAuthenticated,selectedCar,setSelectedCar,logout }}>
      {children}
    </AuthContext.Provider>
  );
};
