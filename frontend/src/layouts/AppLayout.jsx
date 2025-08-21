import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

function AppLayout() {
  return (
    <div className="mx-auto grid h-screen grid-rows-[auto_1fr_auto]">
      <Header />
      <div className="">
        <main className="mx-auto max-w-7xl">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default AppLayout;
