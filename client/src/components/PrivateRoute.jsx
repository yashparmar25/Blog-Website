import { Outlet,Navigate} from 'react-router-dom';
import { useSelector } from 'react-redux';
const PrivateRoute = () => {
  const {currentUser}  = useSelector((state)=>(state.user))
 
  // Check if the user is authenticated (you can replace this logic)
  return currentUser ? <Outlet/>:<Navigate to='/sign-in'/>;
};

export default PrivateRoute;
