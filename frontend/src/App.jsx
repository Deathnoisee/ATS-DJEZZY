import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// PUBLIC
import Home from "./public-page/Home";
import Login from "./public-page/Login";
import Signup from "./public-page/Signup";
// CANDIDATE
import CandidateDashboard from "./candidate/Dashboard";

// RH
import RHLayout from "./rh/RHLayout";
import Accounts from "./rh/Accountrh";
import Jobs from "./rh/Jobrh"; 
import RHDashboard from "./rh/Dashboardrh";
import CreateJobPage from "./rh/job_creation_update/pages/createJobPage.jsx";
import UpdateJobPage from "./rh/job_creation_update/pages/updateJobPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* CANDIDATE */}
        <Route path="/candidate" element={<CandidateDashboard />} />

        {/* RH */}
        <Route path="/rh" element={<RHLayout />}>
          <Route index element={<RHDashboard />} /> 
          <Route path="accounts" element={<Accounts />} /> 
          <Route path="jobs" element={<Jobs />} />
          <Route path="create_job" element={<CreateJobPage />} />
          <Route path="update_job" element={<UpdateJobPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
