
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createResume } from '../services/resumeService';
import { jsPDF } from 'jspdf';

const ResumeBuilder =()=> {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    education: [{ degree: '', institution: '', year: '' }],
    skills: [''],
    experience: [{ title: '', company: '', duration: '' }],
    certifications: [''],
    github: '',
    languages: ['']
  });
  const [generatedResume, setGeneratedResume] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e, index, field, subField) => {
    const newFormData = { ...formData };
    if (subField) {
      newFormData[field][index][subField] = e.target.value;
    } else if (index !== undefined) {
      newFormData[field][index] = e.target.value;
    } else {
      newFormData[field] = e.target.value;
    }
    setFormData(newFormData);
  };

  const addField = (field) => {
    const newFormData = { ...formData };
    if (field === 'education') newFormData[field].push({ degree: '', institution: '', year: '' });
    else if (field === 'experience') newFormData[field].push({ title: '', company: '', duration: '' });
    else newFormData[field].push('');
    setFormData(newFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await createResume(formData);
      setGeneratedResume(response.generatedResume);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await createResume(formData);
      navigate('/my-resumes');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    doc.text(generatedResume, 10, 10);
    doc.save('resume.pdf');
  };

  if (generatedResume && !isEditing) {
    return (
      <div className="mt-5">
        <h2>Generated Resume</h2>
        <pre>{generatedResume}</pre>
        <button onClick={() => setIsEditing(true)} className="btn btn-primary mx-2">Edit</button>
        <button onClick={handleSave} className="btn btn-success mx-2">Save</button>
        <button onClick={handleDownload} className="btn btn-info mx-2">Download</button>
      </div>
    );
  }

  return (
    <div className="mt-5">
      <h2>Generate Resume</h2>
      {loading && <div className="spinner-border" role="status"><span className="visually-hidden">Loading...</span></div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Name</label>
          <input type="text" className="form-control" value={formData.name} onChange={(e) => handleChange(e, undefined, 'name')} required />
        </div>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control" value={formData.email} onChange={(e) => handleChange(e, undefined, 'email')} required />
        </div>
        <div className="mb-3">
          <label>Phone</label>
          <input type="text" className="form-control" value={formData.phone} onChange={(e) => handleChange(e, undefined, 'phone')} required />
        </div>
        <div className="mb-3">
          <label>Education</label>
          {formData.education.map((edu, index) => (
            <div key={index} className="row mb-2">
              <div className="col">
                <input type="text" className="form-control" placeholder="Degree" value={edu.degree} onChange={(e) => handleChange(e, index, 'education', 'degree')} required />
              </div>
              <div className="col">
                <input type="text" className="form-control" placeholder="Institution" value={edu.institution} onChange={(e) => handleChange(e, index, 'education', 'institution')} required />
              </div>
              <div className="col">
                <input type="text" className="form-control" placeholder="Year" value={edu.year} onChange={(e) => handleChange(e, index, 'education', 'year')} required />
              </div>
            </div>
          ))}
          <button type="button" className="btn btn-outline-primary" onClick={() => addField('education')}>+</button>
        </div>
        <div className="mb-3">
          <label>Skills</label>
          {formData.skills.map((skill, index) => (
            <input key={index} type="text" className="form-control mb-2" value={skill} onChange={(e) => handleChange(e, index, 'skills')} required />
          ))}
          <button type="button" className="btn btn-outline-primary" onClick={() => addField('skills')}>+</button>
        </div>
        <div className="mb-3">
          <label>Experience</label>
          {formData.experience.map((exp, index) => (
            <div key={index} className="row mb-2">
              <div className="col">
                <input type="text" className="form-control" placeholder="Title" value={exp.title} onChange={(e) => handleChange(e, index, 'experience', 'title')} required />
              </div>
              <div className="col">
                <input type="text" className="form-control" placeholder="Company" value={exp.company} onChange={(e) => handleChange(e, index, 'experience', 'company')} required />
              </div>
              <div className="col">
                <input type="text" className="form-control" placeholder="Duration" value={exp.duration} onChange={(e) => handleChange(e, index, 'experience', 'duration')} required />
              </div>
            </div>
          ))}
          <button type="button" className="btn btn-outline-primary" onClick={() => addField('experience')}>+</button>
        </div>
        <div className="mb-3">
          <label>Certifications</label>
          {formData.certifications.map((cert, index) => (
            <input key={index} type="text" className="form-control mb-2" value={cert} onChange={(e) => handleChange(e, index, 'certifications')} required />
          ))}
          <button type="button" className="btn btn-outline-primary" onClick={() => addField('certifications')}>+</button>
        </div>
        <div className="mb-3">
          <label>GitHub</label>
          <input type="text" className="form-control" value={formData.github} onChange={(e) => handleChange(e, undefined, 'github')} />
        </div>
        <div className="mb-3">
          <label>Languages</label>
          {formData.languages.map((lang, index) => (
            <input key={index} type="text" className="form-control mb-2" value={lang} onChange={(e) => handleChange(e, index, 'languages')} required />
          ))}
          <button type="button" className="btn btn-outline-primary" onClick={() => addField('languages')}>+</button>
        </div>
        <button type="submit" className="btn btn-primary mx-2">Generate</button>
        <button type="button" className="btn btn-secondary mx-2" onClick={() => navigate('/')}>Cancel</button>
      </form>
    </div>
  );
}

export default ResumeBuilder;