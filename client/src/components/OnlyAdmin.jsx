import { Outlet,Navigate} from 'react-router-dom';
import { useSelector } from 'react-redux';
const OnlyAdmin = () => {
  const {currentUser}  = useSelector((state)=>(state.user))
 
  // Check if the user is authenticated (you can replace this logic)
  return currentUser&&currentUser.isAdmin ? <Outlet/>:<Navigate to='/sign-in'/>;
};

export default OnlyAdmin;
