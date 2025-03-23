import { useState, useEffect } from 'react';
import { getUsers, getUserResumes, deleteUser, deleteResume } from '../services/adminService';

const AdminDashboard = () => {
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

      if (data.length > 0) {
        alert("Scroll down to see the resumes.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await deleteUser(userId);
      setUsers(users.filter((u) => u.id !== userId));
      alert("User deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete the user.");
    }
  };

  const handleDeleteResume = async (resumeId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this resume?");
    if (!confirmDelete) return;

    try {
      await deleteResume(resumeId);
      setResumes(resumes.filter((r) => r.id !== resumeId));
      alert("Resume deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete the resume.");
    }
  };


  const formatResumeText = (text) => {
    const lines = text.split('\n');

    return lines.map((line, index) => {
      const trimmedLine = line.trim();

      if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        const heading = trimmedLine.slice(2, -2);
        return <h4 key={index} className="mt-3"><strong>{heading}</strong></h4>;
      }

      else if (trimmedLine.startsWith('*') && !trimmedLine.startsWith('**')) {
        const bulletText = trimmedLine.slice(1).trim();
        return (
          <p key={index} className="mb-1" style={{ marginLeft: '20px' }}>
            • {bulletText}
          </p>
        );
      }

      else if (trimmedLine === '') {
        return <br key={index} />;
      }

      else {
        return <p key={index} className="mb-2">{trimmedLine}</p>;
      }
    });
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
                <button 
                  className="btn btn-info mx-2" 
                  onClick={() => fetchResumes(user.id)}
                >
                  View Resumes
                </button>
                <button 
                  className="btn btn-danger" 
                  onClick={() => handleDeleteUser(user.id)}
                >
                  Delete
                </button>
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
            <div>
              {resumes.map((resume) => (
                <div key={resume.id} className="card mb-4">
                  <div className="card-body">
                    <h5 className="card-title">
                    Created At: {new Date(resume.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                    </h5>
                    <div className="resume-content">
                      {formatResumeText(resume.generatedResume)}
                    </div>
                    <div className="text-end mt-2">
                      <button 
                        className="btn btn-danger" 
                        onClick={() => handleDeleteResume(resume.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
