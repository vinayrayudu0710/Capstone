import { useState, useEffect, useRef } from 'react';
import { getMyResumes } from '../services/resumeService';
import jsPDF from 'jspdf';

const MyResumes = () => {
  const [resumes, setResumes] = useState([]);
  const resumeRefs = useRef({}); 
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

  const formatResumeText = (text) => {
    const lines = text.split('\n');

    return lines.map((line, index) => {
      const trimmedLine = line.trim();

      if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        const heading = trimmedLine.slice(2, -2);
        return <h4 key={index} className="mt-3"><strong>{heading}</strong></h4>;
      } else if (trimmedLine.startsWith('*') && !trimmedLine.startsWith('**')) {
        const bulletText = trimmedLine.slice(1).trim();
        return (
          <p key={index} className="mb-1" style={{ marginLeft: '20px' }}>
            • {bulletText}
          </p>
        );
      } else if (trimmedLine === '') {
        return <br key={index} />;
      } else {
        return <p key={index} className="mb-2">{trimmedLine}</p>;
      }
    });
  };

  const downloadResume = async(id) => {
    const resume = resumes.find((r) => r.id === id);

    if (!resume) {
      console.error(`Resume with ID ${id} not found.`);
      return;
    }

    const doc = new jsPDF();
    const lineHeight = 10;
    let y = 10;

    const addTextWithStyle = (text, isHeading = false, isBullet = false) => {
      if (isHeading) {
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(text, 10, y);
      } else if (isBullet) {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`• ${text}`, 15, y);
      } else {
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(text, 10, y);
      }
      y += lineHeight;

      if (y > 280) {
        doc.addPage();
        y = 10;
      }
    };

    const lines = resume.generatedResume.split('\n');

    lines.forEach((line) => {
      const trimmedLine = line.trim();

      if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        addTextWithStyle(trimmedLine.slice(2, -2), true);
      } else if (trimmedLine.startsWith('*')) {
        addTextWithStyle(trimmedLine.slice(1).trim(), false, true);
      } else if (trimmedLine === '') {
        y += lineHeight / 2;
      } else {
        addTextWithStyle(trimmedLine);
      }
    });

    doc.save(`resume-${id}.pdf`);
  };
  return (
    <div className="mt-5 container">
      <h2 className="text-center mb-4">My Resumes</h2>
      {resumes.length === 0 ? (
        <p className="text-center">No resumes were saved.</p>
      ) : (
        <div className="list-group">
          {resumes.map((resume) => (
            <div key={resume.id} className="list-group-item mb-3">
              <h5 className="mb-3">
                Created At: {new Date(resume.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </h5>
              
              <div className="card">
                <div className="card-body">
                  <div
                    className="resume-content"
                    ref={(el) => (resumeRefs.current[resume.id] = el)}  // Store the reference correctly
                  >
                    {formatResumeText(resume.generatedResume)}
                  </div>
                </div>
              </div>

              <div className="text-end mt-2">
                <button
                  className="btn btn-primary"
                  onClick={() => downloadResume(resume.id)}
                >
                  Download Resume
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyResumes;
