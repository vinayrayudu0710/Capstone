import { useState, useEffect } from 'react';
import { getMyResumes } from '../services/resumeService';

const MyResumes =()=> {
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const data = await getMyResumes();
        setResumes(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchResumes();
  }, []);

  return (
    <div className="mt-5">
      <h2>My Resumes</h2>
      {resumes.length === 0 ? (
        <p>No resumes were saved</p>
      ) : (
        <ul className="list-group">
          {resumes.map((resume) => (
            <li key={resume.id} className="list-group-item">
              <h5>Created At: {new Date(resume.createdAt).toLocaleDateString()}</h5>
              <pre>{resume.generatedResume}</pre>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyResumes;