import { useState } from 'react'
import { calculateChances } from '../utils/chanceCalculator'

export default function CollegeResults({ colleges, loading, error, studentData }) {
  const [sortBy, setSortBy] = useState('personalizedRate')
  const [selectedCollege, setSelectedCollege] = useState(null)

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="loading loading-spinner loading-lg"></div>
        <p className="mt-4">Calculating your chances...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Error: {error}</span>
      </div>
    )
  }

  const collegesWithChances = colleges.map(college => ({
    ...college,
    chances: calculateChances(college, studentData)
  }));

  // Sort colleges based on selected criteria
  const sortedColleges = [...collegesWithChances].sort((a, b) => {
    if (sortBy === 'personalizedRate') {
      return parseFloat(b.chances.personalizedRate) - parseFloat(a.chances.personalizedRate);
    }
    return parseFloat(b.chances.baseRate) - parseFloat(a.chances.baseRate);
  });

  // Group colleges by admission difficulty
  const groupedColleges = {
    reach: sortedColleges.filter(c => parseFloat(c.chances.personalizedRate) < 30),
    target: sortedColleges.filter(c => parseFloat(c.chances.personalizedRate) >= 30 && parseFloat(c.chances.personalizedRate) < 60),
    likely: sortedColleges.filter(c => parseFloat(c.chances.personalizedRate) >= 60)
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your College Matches</h2>
        <select 
          className="select select-bordered"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="personalizedRate">Sort by Your Chances</option>
          <option value="baseRate">Sort by Standard Rate</option>
        </select>
      </div>

      {/* College Categories */}
      <div className="space-y-6">
        {/* Reach Schools */}
        {groupedColleges.reach.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-4 text-error">Reach Schools</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedColleges.reach.map(college => (
                <CollegeCard 
                  key={college.id} 
                  college={college}
                  onSelect={() => setSelectedCollege(college)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Target Schools */}
        {groupedColleges.target.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-4 text-warning">Target Schools</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedColleges.target.map(college => (
                <CollegeCard 
                  key={college.id} 
                  college={college}
                  onSelect={() => setSelectedCollege(college)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Likely Schools */}
        {groupedColleges.likely.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold mb-4 text-success">Likely Schools</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupedColleges.likely.map(college => (
                <CollegeCard 
                  key={college.id} 
                  college={college}
                  onSelect={() => setSelectedCollege(college)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* College Details Modal */}
      {selectedCollege && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-3xl">
            <h3 className="font-bold text-lg">{selectedCollege['school.name']}</h3>
            <div className="py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold">Your Chances</h4>
                  <div className="text-2xl font-bold text-primary">
                    {selectedCollege.chances.personalizedRate}%
                  </div>
                  <div className="text-sm text-base-content/70">
                    Standard: {selectedCollege.chances.baseRate}%
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold">Admissions Stats</h4>
                  <div>SAT: {selectedCollege['latest.admissions.sat_scores.average.overall']}</div>
                  <div>ACT: {selectedCollege['latest.admissions.act_scores.midpoint.cumulative']}</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold">Chance Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Academic Points:</span>
                    <span>{selectedCollege.chances.details.academicPoints}/70</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Extracurricular Points:</span>
                    <span>{selectedCollege.chances.details.extracurricularPoints}/20</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Awards Points:</span>
                    <span>{selectedCollege.chances.details.awardPoints}/10</span>
                  </div>
                  <div className="divider"></div>
                  <div className="flex justify-between font-bold">
                    <span>Total Points:</span>
                    <span>{selectedCollege.chances.details.totalPoints}/100</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-action">
              <button className="btn" onClick={() => setSelectedCollege(null)}>Close</button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setSelectedCollege(null)}>close</button>
          </form>
        </dialog>
      )}
    </div>
  )
}

// College Card Component
function CollegeCard({ college, onSelect }) {
  // Helper function to display SAT info
  const getSATDisplay = (college) => {
    if (!college['latest.admissions.sat_scores.average.overall'] && 
        college['latest.admissions.test_requirements'] === 'not required') {
      return 'Not Required';
    }
    return college['latest.admissions.sat_scores.average.overall'] 
      ? college['latest.admissions.sat_scores.average.overall'].toLocaleString()
      : 'N/A';
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{college['school.name']}</h2>
        <p className="text-sm">
          {college['school.city']}, {college['school.state']}
        </p>
        <div className="space-y-2 mt-4">
          <div className="flex justify-between items-center">
            <span className="text-sm">Your Chances:</span>
            <span className="font-bold text-primary">
              {college.chances.personalizedRate}%
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Standard Rate:</span>
            <span className="text-base-content/70">
              {college.chances.baseRate}%
            </span>
          </div>
          <div className="divider my-1"></div>
          <p>
            Avg SAT: {getSATDisplay(college)}
          </p>
          <p>
            Annual Cost: ${college['latest.cost.attendance.academic_year']?.toLocaleString()}
          </p>
        </div>
        <div className="card-actions justify-end mt-4">
          <button className="btn btn-primary btn-sm" onClick={onSelect}>
            View Details
          </button>
        </div>
      </div>
    </div>
  )
} 