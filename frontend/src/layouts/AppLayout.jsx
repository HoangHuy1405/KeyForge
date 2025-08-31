import { Outlet, useNavigation } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { CircularProgress } from '@mui/material';

function AppLayout() {
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  return (
    <div className="mx-auto grid h-full min-h-screen grid-rows-[auto_1fr_auto] bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      {/* <main className="mx-auto max-w-7xl"> */}
      <main className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center">
        {isLoading ? <CircularProgress color="inherit" /> : <Outlet />}
        {/* <Outlet /> */}
      </main>
      <Footer />
    </div>
  );
}

export default AppLayout;
