import { BrowserRouter, Routes, Route } from "react-router-dom";

// PUBLIC
import Home from "./public-page/Home";
import Login from "./public-page/Login";
import Signup from "./public-page/Signup";
// CANDIDATE
import CandidateDashboard from "./candidate/Dashboard";

// RH
import RHDashboard from "./rh/Dashboardrh";
import CreateJobPage from "./rh/job_creation_update/pages/createJobPage";
import UpdateJobPage from "./rh/job_creation_update/pages/updateJobPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* CANDIDATE */}
        <Route path="/candidate" element={<CandidateDashboard />} />
        {/* CANDIDATE */}
        <Route path="/candidate" element={<CandidateDashboard />} />

        {/* RH */}
        <Route path="/rh" element={<RHDashboard />} />
        <Route path="/rh/create_job" element={<CreateJobPage />} />
        <Route path="/rh/update_job/:jobUuid" element={<UpdateJobPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
{/*import { useState } from 'react'
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

export default App*/}
