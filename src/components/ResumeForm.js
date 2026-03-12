import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Upload, Sparkles, Loader2 } from 'lucide-react';
import { enhanceText } from '../utils/gemini';

const ResumeForm = ({ resumeData, updateResumeData, jobDescription, setJobDescription }) => {
  const [activeSection, setActiveSection] = useState('personalInfo');
  const [newSkill, setNewSkill] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(null); // 'summary', 'experience-0', 'project-0' etc.

  const handleEnhance = async (text, section, index = null) => {
    if (!text || text.trim().length < 5) {
      alert("Please enter some text first to let AI enhance it.");
      return;
    }

    const loadingId = index !== null ? `${section}-${index}` : section;
    setIsEnhancing(loadingId);

    try {
      const enhanced = await enhanceText(text, section, jobDescription);
      if (index !== null) {
        const item = resumeData[section][index];
        updateArrayItem(section, index, { ...item, description: enhanced });
      } else {
        updateResumeData(section, enhanced);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setIsEnhancing(null);
    }
  };

  const sections = [
    { id: 'personalInfo', label: 'Contact Info' },
    { id: 'summary', label: 'Summary' },
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'education', label: 'Education' },
    { id: 'projects', label: 'Projects' },
    { id: 'certifications', label: 'Certifications' }
  ];

  const addArrayItem = (section, newItem) => {
    const currentArray = resumeData[section] || [];
    updateResumeData(section, [...currentArray, newItem]);
  };

  const updateArrayItem = (section, index, updatedItem) => {
    const currentArray = [...resumeData[section]];
    currentArray[index] = updatedItem;
    updateResumeData(section, currentArray);
  };

  const removeArrayItem = (section, index) => {
    const currentArray = resumeData[section].filter((_, i) => i !== index);
    updateResumeData(section, currentArray);
  };

  const renderPersonalInfo = () => (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Full Name"
        value={resumeData.personalInfo.fullName}
        onChange={(e) => updateResumeData('personalInfo', { ...resumeData.personalInfo, fullName: e.target.value })}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <input
        type="email"
        placeholder="Email Address"
        value={resumeData.personalInfo.email}
        onChange={(e) => updateResumeData('personalInfo', { ...resumeData.personalInfo, email: e.target.value })}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <input
        type="tel"
        placeholder="Phone Number"
        value={resumeData.personalInfo.phone}
        onChange={(e) => updateResumeData('personalInfo', { ...resumeData.personalInfo, phone: e.target.value })}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <input
        type="text"
        placeholder="Location (City, State)"
        value={resumeData.personalInfo.location}
        onChange={(e) => updateResumeData('personalInfo', { ...resumeData.personalInfo, location: e.target.value })}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <input
        type="url"
        placeholder="LinkedIn Profile"
        value={resumeData.personalInfo.linkedin}
        onChange={(e) => updateResumeData('personalInfo', { ...resumeData.personalInfo, linkedin: e.target.value })}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <input
        type="url"
        placeholder="GitHub Profile"
        value={resumeData.personalInfo.github}
        onChange={(e) => updateResumeData('personalInfo', { ...resumeData.personalInfo, github: e.target.value })}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  );

  const renderSummary = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">Summary</label>
        <button
          onClick={() => handleEnhance(resumeData.summary, 'summary')}
          disabled={isEnhancing === 'summary'}
          className="flex items-center gap-2 text-sm px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors disabled:opacity-50"
        >
          {isEnhancing === 'summary' ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Sparkles size={16} />
          )}
          Enhance with AI
        </button>
      </div>
      <textarea
        placeholder="Write a compelling professional summary (2-3 sentences highlighting your key strengths and career objectives)"
        value={resumeData.summary}
        onChange={(e) => updateResumeData('summary', e.target.value)}
        rows={4}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      />
      <p className="text-sm text-gray-600">
        Tip: Include relevant keywords from your target job description
      </p>
    </div>
  );

  const renderSkills = () => {
    const addSkill = () => {
      if (newSkill.trim()) {
        const currentSkills = resumeData.skills || [];
        updateResumeData('skills', [...currentSkills, newSkill.trim()]);
        setNewSkill('');
      }
    };

    const removeSkill = (index) => {
      const currentSkills = resumeData.skills.filter((_, i) => i !== index);
      updateResumeData('skills', currentSkills);
    };

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add a skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={addSkill}
            className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(resumeData.skills || []).map((skill, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {skill}
              <button
                onClick={() => removeSkill(index)}
                className="text-blue-600 hover:text-blue-800"
              >
                <Trash2 size={14} />
              </button>
            </span>
          ))}
        </div>
      </div>
    );
  };

  const renderExperience = () => (
    <div className="space-y-4">
      {(resumeData.experience || []).map((exp, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 border rounded-lg space-y-3"
        >
          <div className="flex justify-between items-start">
            <h4 className="font-medium">Experience {index + 1}</h4>
            <button
              onClick={() => removeArrayItem('experience', index)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <input
            type="text"
            placeholder="Job Title"
            value={exp.title || ''}
            onChange={(e) => updateArrayItem('experience', index, { ...exp, title: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Company Name"
            value={exp.company || ''}
            onChange={(e) => updateArrayItem('experience', index, { ...exp, company: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Start Date (MM/YYYY)"
              value={exp.startDate || ''}
              onChange={(e) => updateArrayItem('experience', index, { ...exp, startDate: e.target.value })}
              className="p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="End Date (MM/YYYY or Present)"
              value={exp.endDate || ''}
              onChange={(e) => updateArrayItem('experience', index, { ...exp, endDate: e.target.value })}
              className="p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <button
                onClick={() => handleEnhance(exp.description, 'experience', index)}
                disabled={isEnhancing === `experience-${index}`}
                className="flex items-center gap-2 text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
              >
                {isEnhancing === `experience-${index}` ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Sparkles size={12} />
                )}
                Enhance with AI
              </button>
            </div>
            <textarea
              placeholder="Job description with achievements and metrics"
              value={exp.description || ''}
              onChange={(e) => updateArrayItem('experience', index, { ...exp, description: e.target.value })}
              rows={3}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
        </motion.div>
      ))}
      <button
        onClick={() => addArrayItem('experience', { title: '', company: '', startDate: '', endDate: '', description: '' })}
        className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
      >
        <Plus size={20} className="mx-auto mb-1" />
        Add Experience
      </button>
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-4">
      {(resumeData.education || []).map((edu, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 border rounded-lg space-y-3"
        >
          <div className="flex justify-between items-start">
            <h4 className="font-medium">Education {index + 1}</h4>
            <button
              onClick={() => removeArrayItem('education', index)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <input
            type="text"
            placeholder="Degree"
            value={edu.degree || ''}
            onChange={(e) => updateArrayItem('education', index, { ...edu, degree: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Institution"
            value={edu.institution || ''}
            onChange={(e) => updateArrayItem('education', index, { ...edu, institution: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Graduation Date (MM/YYYY)"
              value={edu.graduationDate || ''}
              onChange={(e) => updateArrayItem('education', index, { ...edu, graduationDate: e.target.value })}
              className="p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="GPA (optional)"
              value={edu.gpa || ''}
              onChange={(e) => updateArrayItem('education', index, { ...edu, gpa: e.target.value })}
              className="p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </motion.div>
      ))}
      <button
        onClick={() => addArrayItem('education', { degree: '', institution: '', graduationDate: '', gpa: '' })}
        className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
      >
        <Plus size={20} className="mx-auto mb-1" />
        Add Education
      </button>
    </div>
  );

  const renderProjects = () => (
    <div className="space-y-4">
      {(resumeData.projects || []).map((proj, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 border rounded-lg space-y-3"
        >
          <div className="flex justify-between items-start">
            <h4 className="font-medium">Project {index + 1}</h4>
            <button
              onClick={() => removeArrayItem('projects', index)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <input
            type="text"
            placeholder="Project Name"
            value={proj.name || ''}
            onChange={(e) => updateArrayItem('projects', index, { ...proj, name: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <button
                onClick={() => handleEnhance(proj.description, 'projects', index)}
                disabled={isEnhancing === `projects-${index}`}
                className="flex items-center gap-2 text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50"
              >
                {isEnhancing === `projects-${index}` ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Sparkles size={12} />
                )}
                Enhance with AI
              </button>
            </div>
            <textarea
              placeholder="Project description and achievements"
              value={proj.description || ''}
              onChange={(e) => updateArrayItem('projects', index, { ...proj, description: e.target.value })}
              rows={3}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>
          <input
            type="text"
            placeholder="Technologies used"
            value={proj.technologies || ''}
            onChange={(e) => updateArrayItem('projects', index, { ...proj, technologies: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </motion.div>
      ))}
      <button
        onClick={() => addArrayItem('projects', { name: '', description: '', technologies: '' })}
        className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
      >
        <Plus size={20} className="mx-auto mb-1" />
        Add Project
      </button>
    </div>
  );

  const renderCertifications = () => (
    <div className="space-y-4">
      {(resumeData.certifications || []).map((cert, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 border rounded-lg space-y-3"
        >
          <div className="flex justify-between items-start">
            <h4 className="font-medium">Certification {index + 1}</h4>
            <button
              onClick={() => removeArrayItem('certifications', index)}
              className="text-red-600 hover:text-red-800"
            >
              <Trash2 size={16} />
            </button>
          </div>
          <input
            type="text"
            placeholder="Certification Name"
            value={cert.name || ''}
            onChange={(e) => updateArrayItem('certifications', index, { ...cert, name: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Issuing Organization"
            value={cert.issuer || ''}
            onChange={(e) => updateArrayItem('certifications', index, { ...cert, issuer: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input
            type="text"
            placeholder="Date Obtained (MM/YYYY)"
            value={cert.date || ''}
            onChange={(e) => updateArrayItem('certifications', index, { ...cert, date: e.target.value })}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </motion.div>
      ))}
      <button
        onClick={() => addArrayItem('certifications', { name: '', issuer: '', date: '' })}
        className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
      >
        <Plus size={20} className="mx-auto mb-1" />
        Add Certification
      </button>
    </div>
  );

  const renderJobDescription = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Upload size={20} className="text-blue-600" />
        <h3 className="font-medium">Job Description (Optional)</h3>
      </div>
      <textarea
        placeholder="Paste the job description here to get keyword matching and ATS optimization suggestions..."
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        rows={6}
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      />
      <p className="text-sm text-gray-600">
        Adding a job description helps optimize your resume for ATS systems and improves keyword matching.
      </p>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'personalInfo': return renderPersonalInfo();
      case 'summary': return renderSummary();
      case 'skills': return renderSkills();
      case 'experience': return renderExperience();
      case 'education': return renderEducation();
      case 'projects': return renderProjects();
      case 'certifications': return renderCertifications();
      case 'jobDescription': return renderJobDescription();
      default: return renderPersonalInfo();
    }
  };

  return (
    <div className="space-y-6">
      {/* Section Navigation */}
      <div className="space-y-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeSection === section.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
          >
            {section.label}
          </button>
        ))}
        <button
          onClick={() => setActiveSection('jobDescription')}
          className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeSection === 'jobDescription'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          Job Description
        </button>
      </div>

      {/* Section Content */}
      <motion.div
        key={activeSection}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-xl font-semibold mb-4">
          {sections.find(s => s.id === activeSection)?.label || 'Job Description'}
        </h2>
        {renderSection()}
      </motion.div>
    </div>
  );
};

export default ResumeForm;