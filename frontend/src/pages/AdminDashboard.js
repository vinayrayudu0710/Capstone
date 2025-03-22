import { useState, useEffect } from 'react';
import { getUsers, getUserResumes, deleteUser, deleteResume } from '../services/adminService';

const AdminDashboard =() => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  const fetchResumes = async (userId) => {
    try {
      const data = await getUserResumes(userId);
      setResumes(data);
      setSelectedUserId(userId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteResume = async (resumeId) => {
    try {
      await deleteResume(resumeId);
      setResumes(resumes.filter(r => r.id !== resumeId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mt-5">
      <h2>Admin Dashboard</h2>
      <h3>Users</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button className="btn btn-info mx-2" onClick={() => fetchResumes(user.id)}>View Resumes</button>
                <button className="btn btn-danger" onClick={() => handleDeleteUser(user.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedUserId && (
        <>
          <h3>Resumes for User ID: {selectedUserId}</h3>
          {resumes.length === 0 ? (
            <p>No resumes found</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Created At</th>
                  <th>Resume</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {resumes.map((resume) => (
                  <tr key={resume.id}>
                    <td>{new Date(resume.createdAt).toLocaleDateString()}</td>
                    <td><pre>{resume.generatedResume}</pre></td>
                    <td>
                      <button className="btn btn-danger" onClick={() => handleDeleteResume(resume.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}

export default AdminDashboard;