import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { ACTIVITIES, AWARDS } from '../data/activitiesData';
import './StudentForm.css';

const COLLEGES = [
  { name: "Harvard University", group: "Ivy League" },
  { name: "Yale University", group: "Ivy League" },
  { name: "Princeton University", group: "Ivy League" },
  { name: "Columbia University", group: "Ivy League" },
  { name: "University of Pennsylvania", group: "Ivy League" },
  { name: "Brown University", group: "Ivy League" },
  { name: "Dartmouth College", group: "Ivy League" },
  { name: "Cornell University", group: "Ivy League" },
  { name: "UC Berkeley", group: "Top Public Universities" },
  { name: "UCLA", group: "Top Public Universities" },
  { name: "University of Michigan", group: "Top Public Universities" },
  { name: "University of Virginia", group: "Top Public Universities" },
  { name: "Georgia Tech", group: "Top Public Universities" },
  { name: "UNC Chapel Hill", group: "Top Public Universities" },
].sort((a, b) => a.name.localeCompare(b.name));

const MAJORS = [
  "Computer Science",
  "Engineering", 
  "Business",
  "Biology",
  "Psychology",
  "English",
  "History",
  "Mathematics",
  "Physics",
  "Chemistry",
];

export default function StudentForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    uwGpa: '3.0',
    wGpa: '3.5',
    sat: '1200',
    act: '24',
    major: '',
    selectedColleges: [],
    extracurriculars: [{ activity: '', level: '', years: '' }],
    awards: [{ name: '', level: '', year: '' }]
  });

  const [collegeSearch, setCollegeSearch] = useState('');
  const [showCollegeDropdown, setShowCollegeDropdown] = useState(false);
  const [activitySearch, setActivitySearch] = useState('');
  const [showActivityDropdown, setShowActivityDropdown] = useState(false);
  const [awardSearches, setAwardSearches] = useState({});
  const [activeDropdown, setActiveDropdown] = useState({ type: null, index: null });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const addExtracurricular = () => {
    setFormData(prev => ({
      ...prev,
      extracurriculars: [...prev.extracurriculars, { activity: '', level: '', years: '' }]
    }));
  };

  const updateExtracurricular = (index, field, value) => {
    setFormData(prev => {
      const newExtracurriculars = [...prev.extracurriculars];
      newExtracurriculars[index] = { ...newExtracurriculars[index], [field]: value };
      return { ...prev, extracurriculars: newExtracurriculars };
    });
  };

  const addAward = () => {
    setFormData(prev => ({
      ...prev,
      awards: [...prev.awards, { name: '', level: '', year: '' }]
    }));
  };

  const updateAward = (index, field, value) => {
    setFormData(prev => {
      const newAwards = [...prev.awards];
      newAwards[index] = { ...newAwards[index], [field]: value };
      return { ...prev, awards: newAwards };
    });
  };

  const filteredColleges = COLLEGES.filter(college => 
    college.name.toLowerCase().includes(collegeSearch.toLowerCase())
  );

  const filteredActivities = ACTIVITIES.filter(activity => 
    activity.name.toLowerCase().includes(activitySearch.toLowerCase())
  );

  const filteredAwards = (index) => AWARDS.filter(award => 
    award.name.toLowerCase().includes(awardSearches[index]?.toLowerCase() || '')
  );

  return (
    <div className="student-form">
      <h1 className="form-title">AdmitAI</h1>
      
      <div className="main-layout">
        {/* Left Column - Academic Info */}
        <div className="left-column">
          <div className="section">
            <h2 className="section-heading">Academic Stats</h2>
            <div className="form-grid">
              <div className="slider-group">
                <label className="slider-label">Unweighted GPA: {formData.uwGpa}</label>
                <input
                  type="range"
                  min="0"
                  max="4.0"
                  step="0.01"
                  value={formData.uwGpa}
                  onChange={(e) => setFormData(prev => ({ ...prev, uwGpa: e.target.value }))}
                  className="slider"
                />
              </div>
              <div className="slider-group">
                <label className="slider-label">Weighted GPA: {formData.wGpa}</label>
                <input
                  type="range"
                  min="0"
                  max="5.0"
                  step="0.01"
                  value={formData.wGpa}
                  onChange={(e) => setFormData(prev => ({ ...prev, wGpa: e.target.value }))}
                  className="slider"
                />
              </div>
              <div className="slider-group">
                <label className="slider-label">SAT Score: {formData.sat}</label>
                <input
                  type="range"
                  min="400"
                  max="1600"
                  step="10"
                  value={formData.sat}
                  onChange={(e) => setFormData(prev => ({ ...prev, sat: e.target.value }))}
                  className="slider"
                />
              </div>
              <div className="slider-group">
                <label className="slider-label">ACT Score: {formData.act}</label>
                <input
                  type="range"
                  min="1"
                  max="36"
                  step="1"
                  value={formData.act}
                  onChange={(e) => setFormData(prev => ({ ...prev, act: e.target.value }))}
                  className="slider"
                />
              </div>
              <div>
                <label className="slider-label">Choice of Major</label>
                <select className="major-select" value={formData.major} onChange={(e) => setFormData(prev => ({ ...prev, major: e.target.value }))}>
                  <option value="">Select your major</option>
                  {MAJORS.map(major => (
                    <option key={major} value={major}>{major}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Activities & Awards */}
        <div className="right-column">
          <div className="section">
            <h2 className="section-heading">Extracurricular Activities</h2>
            <div className="section-spacing">
              
              <input 
                className="dropdown-field"
                placeholder="Add an activity"
                value={activitySearch}
                onChange={(e) => {
                  setActivitySearch(e.target.value);
                  setShowActivityDropdown(true);
                }}
              />
              {showActivityDropdown && activitySearch && (
                <div className="dropdown-menu">
                  {filteredActivities.map((activity, idx) => (
                    <div
                      key={idx}
                      className="dropdown-item"
                      onClick={() => {
                        updateExtracurricular(0, 'activity', activity.name);
                        setActivitySearch('');
                        setShowActivityDropdown(false);
                      }}
                    >
                      {activity.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Selected Activities with Achievement Levels */}
            {formData.extracurriculars.map((activity, index) => (
              activity.activity && (
                <div key={index} className="selected-item">
                  <div>
                    <div className="activity-name">{activity.activity}</div>
                    <select
                      value={activity.level}
                      onChange={(e) => updateExtracurricular(index, 'level', e.target.value)}
                      className="achievement-select"
                    >
                      <option value="">Select achievement level</option>
                      {ACTIVITIES.find(a => a.name === activity.activity)?.achievementLevels.map(level => (
                        <option key={level.level} value={level.level}>
                          Level {level.level} - {level.description}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => {
                      const newActivities = formData.extracurriculars.filter((_, i) => i !== index);
                      setFormData(prev => ({ ...prev, extracurriculars: newActivities }));
                    }}
                    className="remove-button"
                  >
                    ✕
                  </button>
                </div>
              )
            ))}

            <button
              onClick={addExtracurricular}
              className="add-button"
            >
              Add Activity
            </button>
          </div>


        </div>
      </div>

      {/* Colleges of Interest Section */}
      <div className="section">
        <h2 className="section-heading">Colleges of Interest</h2>
        <div className="colleges-section">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search colleges..."
                  value={collegeSearch}
                  onChange={(e) => {
                    setCollegeSearch(e.target.value);
                    setShowCollegeDropdown(true);
                  }}
                  className="input input-bordered w-full"
                />
                {showCollegeDropdown && collegeSearch && (
                  <div className="absolute z-10 w-full bg-base-100 shadow-xl max-h-60 overflow-auto rounded-lg mt-1">
                    {filteredColleges.map((college, index) => (
                      <div
                        key={index}
                        className="p-3 hover:bg-base-200 cursor-pointer"
                        onClick={() => {
                          if (!formData.selectedColleges.includes(college.name)) {
                            setFormData(prev => ({
                              ...prev,
                              selectedColleges: [...prev.selectedColleges, college.name]
                            }));
                          }
                          setCollegeSearch('');
                          setShowCollegeDropdown(false);
                        }}
                      >
                        <div className="font-medium">{college.name}</div>
                        <div className="text-sm opacity-70">{college.group}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.selectedColleges.map((college, index) => (
                  <div key={index} className="badge badge-lg gap-2">
                    {college}
                    <button
                      type="button"
                      onClick={() => {
                        const newColleges = formData.selectedColleges.filter((_, i) => i !== index);
                        setFormData(prev => ({ ...prev, selectedColleges: newColleges }));
                      }}
                      className="hover:bg-base-300 rounded-full"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <button onClick={handleSubmit} className="submit-button">Calculate My Chances</button>
    </div>
  );
}