import { useSession } from "@/context/useSession"
import { PublicRoutes } from "@/models";
import { Navigate } from "react-router-dom";
import { Outlet } from "react-router-dom";

/**
 * To check if app has a valid session otherwise redirect to /login
 * @returns result route
 */
const AuthGuard = () => {
    const { session, isLoading } = useSession();
    const idUser = session?.user?.id;
    if (isLoading) {
        return <><h3>Loading session...</h3></>
    }
    return idUser ? <Outlet/> : <Navigate replace to={PublicRoutes.LOGIN}/>;
}

export default AuthGuard;