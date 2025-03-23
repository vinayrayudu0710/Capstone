import { Link } from "react-router-dom";

const Navbar = ({ isLoggedIn, role, handleLogout }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">AI Resume Builder</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/generate-resume" className="nav-link">Generate Resume</Link>
            </li>
            {!isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link to="/signup" className="nav-link">SignUp</Link>
                </li>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">Login</Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/my-resumes" className="nav-link">My Resumes</Link>
                </li>
                {role === "Admin" && (
                  <li className="nav-item">
                    <Link to="/admin-dashboard" className="nav-link">Admin Dashboard</Link>
                  </li>
                )}
                <li className="nav-item">
                  <button onClick={handleLogout} className="btn btn-outline-danger nav-link">Logout</button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;