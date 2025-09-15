import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getRoles } from '../../redux/slice/accountSlice';

export default function SellerProtectedRoute({ children }) {
  const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
  let roles = useSelector(getRoles);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (!roles.includes('ROLE_SELLER')) {
    toast.info('Please register as seller before doing this', {
      toastId: 'ERROR NOT SELLER',
    });
    return <Navigate to="/seller/register" replace />;
  }
  return children;
}
