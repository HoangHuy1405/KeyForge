import React from 'react';
import { Outlet } from 'react-router-dom';
import { useTheme } from '@mui/material';

const AuthPage = () => {
  const theme = useTheme();

  return (
    <div className="flex h-screen">
      {/* Bên trái */}
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="text-center">
          <div
            className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-lg text-5xl font-bold"
            style={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
            }}
          >
            B
          </div>
          <h1
            className="text-3xl font-bold"
            style={{ color: theme.palette.secondary.main }}
          >
            Bazaar
          </h1>
          <p className="mt-2" style={{ color: theme.palette.text.secondary }}>
            Nền tảng thương mại điện tử <br /> yêu thích ở Đông Nam Á & Đài Loan
          </p>
        </div>
      </div>

      {/* Bên phải */}
      <div
        className="flex flex-1 items-center justify-center p-6"
        style={{ backgroundColor: theme.palette.background.default }}
      >
        <div className="w-full max-w-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
