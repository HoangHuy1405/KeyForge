import { Outlet, useNavigation } from 'react-router-dom';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { CircularProgress } from '@mui/material';

function AppLayout() {
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';

  // if (loading) {
  //   return (
  //     <div className="flex min-h-[60vh] items-center justify-center">
  //       <CircularProgress />
  //     </div>
  //   );
  // }

  return (
    <div className="mx-auto grid h-screen grid-rows-[auto_1fr_auto]">
      <Header />
      {/* {isLoading ? (
        <div className="flex min-h-[60vh] items-center justify-center">
          <CircularProgress />
        </div>
      ) : ( */}
      <main className="mx-auto max-w-7xl">
        {isLoading ? <CircularProgress /> : <Outlet />}
      </main>
      {/* )} */}
      <Footer />
    </div>
  );
}

export default AppLayout;
