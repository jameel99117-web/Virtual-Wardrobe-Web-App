import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import setAuthToken from './utils/setAuthToken';

import MyOutfits from "./components/MyOutfits";
import OutfitDetail from "./components/OutfitDetail";
import HomePage from './components/HomePage';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import AddItem from "./components/AddItem";

import PrivateRoute from './components/PrivateRoute';
import CreateOutfit from './components/CreateOutfit';

const AppRouter = () => {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setAuthToken(token);
  }, []);

  return (
    <Router>
      <Routes>
        {/* Landing page */}
        <Route path="/" element={<HomePage />} />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/add-item"
          element={
            <PrivateRoute>
              <AddItem />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-outfit"
          element={
            <PrivateRoute>
              <CreateOutfit />
            </PrivateRoute>
          }
        />
        <Route
          path="/outfits"
          element={
            <PrivateRoute>
              <MyOutfits />
            </PrivateRoute>
          }
        />
        <Route
          path="/outfits/:id"
          element={
            <PrivateRoute>
              <OutfitDetail />
            </PrivateRoute>
          }
        />
        
        

        {/* Redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
