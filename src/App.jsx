import { useState } from 'react'
import StudentForm from './components/StudentForm'
import CollegeResults from './components/CollegeResults'
import { searchColleges } from './api/collegeService'
import './App.css'

function App() {
  const [colleges, setColleges] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showResults, setShowResults] = useState(false)
  const [formData, setFormData] = useState(null)

  const handleFormSubmit = async (data) => {
    console.log('Form submitted with data:', data)
    
    try {
      setLoading(true)
      setError(null)
      
      // If no colleges selected, show error
      if (!data.selectedColleges || data.selectedColleges.length === 0) {
        throw new Error('Please select at least one college of interest')
      }

      // Create an array of promises for each selected college
      const collegePromises = data.selectedColleges.map(async (collegeName) => {
        try {
          const params = {
            'school.name': collegeName,
            'fields': [
              'id',
              'school.name',
              'school.city',
              'school.state',
              'school.zip',
              'latest.admissions.admission_rate.overall',
              'latest.admissions.sat_scores.average.overall',
              'latest.admissions.act_scores.midpoint.cumulative',
              'latest.cost.attendance.academic_year',
              'latest.admissions.sat_scores.midpoint.math',
              'latest.admissions.sat_scores.midpoint.critical_reading',
              'latest.student.size',
            ].join(','),
          }
          
          const results = await searchColleges(params)
          return results?.[0]
        } catch (error) {
          console.error(`Error fetching data for ${collegeName}:`, error)
          return null
        }
      })

      const results = await Promise.all(collegePromises)
      const validResults = results.filter(college => college !== null)
      
      if (validResults.length === 0) {
        throw new Error('No data available for selected colleges')
      }

      setColleges(validResults)
      setFormData(data)
      setShowResults(true) // Move this here, after successful data fetch
      
    } catch (err) {
      console.error('Error:', err)
      setError(err.message || 'An error occurred while fetching colleges')
      setColleges([])
    } finally {
      setLoading(false)
      // Scroll to results only if we have results to show
      if (!error) {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: 'smooth'
        })
      }
    }
  }

  return (
    <div className="bg-white">
      <StudentForm onSubmit={handleFormSubmit} />
      
      {showResults && (
        <div id="results-section">
          <CollegeResults 
            colleges={colleges}
            loading={loading}
            error={error}
            studentData={formData}
          />
        </div>
      )}
    </div>
  )
}

export default App
