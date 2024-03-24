import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import HomePage from '../HomePage';

const PrivateRoute = ({component:Component}) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
    return <Component/>
};

export default PrivateRoute;
