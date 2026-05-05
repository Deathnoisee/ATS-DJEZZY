import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// PUBLIC
import Home from "./public-page/Home";
import Login from "./public-page/Login";
import Signup from "./public-page/Signup";
// CANDIDATE
import CandidateLayout from "./candidate/Candidalayout";
import CandidateDashboard from "./candidate/Dashboard";
import CandidaAccounts from "./candidate/Accountcandidate";
import CandidaJobs from "./candidate/cvcandidate.jsx";

// RH
import RHLayout from "./rh/RHLayout";
import Accounts from "./rh/Accountrh";
import Jobs from "./rh/Jobrh";
import RHDashboard from "./rh/Dashboardrh";
import CreateJobPage from "./rh/job_creation_update/pages/createJobPage.jsx";
import UpdateJobPage from "./rh/job_creation_update/pages/updateJobPage.jsx";

import RequireAuth from "./components/RequireAuth";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* CANDIDATE */}
      
        <Route path="/candidate" element={<CandidateLayout />}>
          <Route index element={<CandidateDashboard />} />
          <Route path="accounts" element={<CandidaAccounts />} />
          <Route path="jobs" element={<CandidaJobs />} />
        </Route>
      -

      {/* RH */}
     
        <Route path="/rh" element={<RHLayout />}>
          <Route index element={<RHDashboard />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="create_job" element={<CreateJobPage />} />
          <Route path="update_job/:jobUuid" element={<UpdateJobPage />} />
        </Route>
    
    </Routes>
    </BrowserRouter >
  );
}

export default App;
