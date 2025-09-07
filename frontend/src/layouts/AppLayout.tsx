import { Outlet, useNavigation } from 'react-router-dom';
import { CircularProgress } from '@mui/material';
import useRestoreSession from '../hooks/useAutoLogin';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatWidget from '../features/Chat/ChatWidget';
import { useSelector } from 'react-redux';
import { checkAuthenticated } from '../redux/slice/accountSlice';

function AppLayout() {
  useRestoreSession();

  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';
  const isAuthenticated = useSelector(checkAuthenticated);

  return (
    <div className="mx-auto grid h-full min-h-screen grid-rows-[auto_1fr_auto] bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <Header />
      {/* <main className="mx-auto max-w-7xl"> */}
      <main className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center">
        {isLoading ? <CircularProgress color="inherit" /> : <Outlet />}
        {/* <Outlet /> */}
      </main>
      <Footer />

      {/* Fixed chat widget  */}
      {isAuthenticated && <ChatWidget />}
    </div>
  );
}

export default AppLayout;
