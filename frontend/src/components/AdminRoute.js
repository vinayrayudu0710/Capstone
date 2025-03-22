import { Navigate } from "react-router-dom";

const AdminRoute = ({isLoggedIn, role, children}) =>{

    return isLoggedIn && role ==="Admin" ? children : <Navigate to="/" />
}

export default AdminRoute;