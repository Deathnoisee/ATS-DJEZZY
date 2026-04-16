import { useState } from 'react'
import Mainpage from './public-page/mainpage.jsx'

function App() {
  const [section, setSection] = useState('public')

  if (section === 'candidate') {
    return (
      <main className="page-placeholder">
        <h1>Candidate page here</h1>
        <button type="button" onClick={() => setSection('public')}>
          Back to public page
        </button>
      </main>
    )
  }

  if (section === 'hr') {
    return (
      <main className="page-placeholder">
        <h1>HR page here</h1>
        <button type="button" onClick={() => setSection('public')}>
          Back to public page
        </button>
      </main>
    )
  }

  return <Mainpage onGoCandidate={() => setSection('candidate')} />
}

export default App
