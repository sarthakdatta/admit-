const API_KEY = import.meta.env.VITE_COLLEGE_SCORECARD_KEY
const BASE_URL = 'https://api.data.gov/ed/collegescorecard/v1/schools'

export async function searchColleges(params) {
  try {
    // Remove undefined values from params
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v != null)
    )

    const queryParams = new URLSearchParams({
      api_key: API_KEY,
      ...cleanParams,
      fields: [
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
    }).toString()

    console.log('Fetching:', `${BASE_URL}?${queryParams}`) // For debugging

    const response = await fetch(`${BASE_URL}?${queryParams}`)
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch college data')
    }

    return data.results || []
  } catch (error) {
    console.error('Error fetching college data:', error)
    throw error
  }
} 