import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme } from '@mui/material';
import Logo from '../../components/Logo';

const AuthPage = () => {
  const theme = useTheme();

  return (
    <div className="flex h-full">
      {/* Bên trái */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-lg text-5xl font-bold">
            <Logo size={100} />
          </div>
          <h1
            className="text-3xl font-bold"
            style={{ color: theme.palette.text.main }}
          >
            Bazaar
          </h1>
          <p className="mt-2" style={{ color: theme.palette.text.secondary }}>
            The favorite e-commerce platform <br /> in Southeast Asia & Taiwan
          </p>
        </div>
      </div>

      {/* Bên phải */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
