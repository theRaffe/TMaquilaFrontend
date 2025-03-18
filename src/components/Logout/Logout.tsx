import { useNavigate } from 'react-router-dom';
import { PublicRoutes } from '../../models';
import { Button } from '@mui/material';
import { useSession } from '@/context/useSession';

function Logout() {
  const navigate = useNavigate();
  const {signOut} = useSession();
  const logOut = async () => {
    await signOut();
    navigate(PublicRoutes.LOGIN, { replace: true });
  };
  return <Button onClick={logOut}>Log Out</Button>;
}
export default Logout;