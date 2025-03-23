import { Link } from "react-router-dom";

const HomePage = ({isLoggedIn, role, handleLogout}) =>{
    return(
        <div className="mt-5 text-center">
            <h1> AI Resume Builder</h1>
            <p> Create professional resumes with the power of AI</p>
            {!isLoggedIn ? (
                <div>
                    
                    <Link to="/generate-resume" className="btn btn-primary mx-2"> Generate Resume</Link>
                    <Link to="/signup" className="btn btn-secondary mx-2">SignUp</Link>
                    <Link to="/login" className="btn btn-outline-primary mx-2">Login</Link>
                </div>
            ) : (
                <div>
                    <Link to="/generate-resume" className="btn btn-primary mx-2">Generate Resume</Link>
                    <Link to="/my-resumes" className="btn btn-secondary mx-2">My Resumes</Link>
                    {role === "Admin" && <Link to="/admin-dashboard" className="btn btn-warning mx-2">Admin Dashboard</Link>}
                    <button onClick={handleLogout} className="btn btn-outline-danger mx-2">Logout</button>

                </div>
            )}


            
        </div>
    )
}

export default HomePage;