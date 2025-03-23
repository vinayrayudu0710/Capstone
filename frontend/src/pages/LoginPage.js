import { useState } from "react";
import { Link } from "react-router-dom";
import { login } from "../services/authService";

const LoginPage = ({setIsLoggedIn, setRole}) =>{
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginSuccess, setLoginSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token } = await login(email, password);

      setIsLoggedIn(true);

      setRole(token.role);

      setLoginSuccess(true);

      setTimeout(() => {
      if (token.role ==="Admin"){
        window.location.href = "/admin-dashboard";
      }else{
        window.location.href = "/";
      }
    }, 2000);

    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="mt-5">
      <h2>Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {loginSuccess && (
        <div className="alert alert-success alert-light bg-info"> Login Successful! Redirecting . . .</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
        <p className="mt-2">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;