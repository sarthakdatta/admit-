import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts'

export default function ResultsPage({ colleges, studentData, onBack }) {
  const [selectedCollege, setSelectedCollege] = useState(null)
  const [view, setView] = useState('table') // 'table' or 'details'

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

  // Prepare data for charts
  const admissionData = colleges.map(college => ({
    name: college['school.name'],
    'Your Chances': parseFloat(college.chances.personalizedRate),
    'Standard Rate': parseFloat(college.chances.baseRate)
  }))

  const satData = colleges.map(college => ({
    name: college['school.name'],
    'College Average': college['latest.admissions.sat_scores.average.overall'],
    'Your Score': parseInt(studentData.sat)
  }))

  return (
    <div className="min-h-screen bg-base-100">
      {/* Navigation Bar */}
      <div className="navbar bg-base-200 shadow-lg mb-8">
        <div className="container mx-auto">
          <button className="btn btn-ghost" onClick={onBack}>← Back</button>
          <div className="flex-1">
            <h1 className="text-xl font-bold ml-4">Your College Matches</h1>
          </div>
          <div className="flex-none">
            <div className="tabs tabs-boxed">
              <a 
                className={`tab ${view === 'table' ? 'tab-active' : ''}`}
                onClick={() => setView('table')}
              >
                Table View
              </a>
              <a 
                className={`tab ${view === 'details' ? 'tab-active' : ''}`}
                onClick={() => setView('details')}
              >
                Analytics
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {view === 'table' ? (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>College</th>
                  <th>Your Chances</th>
                  <th>Standard Rate</th>
                  <th>SAT</th>
                  <th>Location</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {colleges.map(college => (
                  <tr key={college.id} className="hover">
                    <td>{college['school.name']}</td>
                    <td className="font-bold text-primary">
                      {college.chances.personalizedRate}%
                    </td>
                    <td>{college.chances.baseRate}%</td>
                    <td>{college['latest.admissions.sat_scores.average.overall']}</td>
                    <td>{college['school.city']}, {college['school.state']}</td>
                    <td>
                      <button 
                        className="btn btn-sm btn-primary"
                        onClick={() => setSelectedCollege(college)}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Admission Chances Comparison */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Admission Chances Comparison</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={admissionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Your Chances" fill="#8884d8" />
                    <Bar dataKey="Standard Rate" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* SAT Score Comparison */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">SAT Score Comparison</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={satData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="College Average" fill="#8884d8" />
                    <Bar dataKey="Your Score" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Additional charts can be added here */}
          </div>
        )}
      </div>

      {/* College Details Modal */}
      {selectedCollege && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-4xl">
            <h3 className="font-bold text-lg">{selectedCollege['school.name']}</h3>
            <div className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-semibold mb-2">Admission Chances</h4>
                  <div className="stats shadow">
                    <div className="stat">
                      <div className="stat-title">Your Chances</div>
                      <div className="stat-value text-primary">
                        {selectedCollege.chances.personalizedRate}%
                      </div>
                      <div className="stat-desc">
                        Standard: {selectedCollege.chances.baseRate}%
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Test Scores</h4>
                  <div className="stats shadow">
                    <div className="stat">
                      <div className="stat-title">Average SAT</div>
                      <div className="stat-value">
                        {selectedCollege['latest.admissions.sat_scores.average.overall']}
                      </div>
                      <div className="stat-desc">
                        Your Score: {studentData.sat}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Points Breakdown */}
              <div className="mt-8">
                <h4 className="font-semibold mb-4">Admission Chances Breakdown</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="stats shadow">
                    <div className="stat">
                      <div className="stat-title">Academic Points</div>
                      <div className="stat-value">
                        {selectedCollege.chances.details.academicPoints}
                      </div>
                      <div className="stat-desc">Out of 70</div>
                    </div>
                  </div>
                  <div className="stats shadow">
                    <div className="stat">
                      <div className="stat-title">Activity Points</div>
                      <div className="stat-value">
                        {selectedCollege.chances.details.extracurricularPoints}
                      </div>
                      <div className="stat-desc">Out of 20</div>
                    </div>
                  </div>
                  <div className="stats shadow">
                    <div className="stat">
                      <div className="stat-title">Awards Points</div>
                      <div className="stat-value">
                        {selectedCollege.chances.details.awardPoints}
                      </div>
                      <div className="stat-desc">Out of 10</div>
                    </div>
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