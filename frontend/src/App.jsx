import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// PUBLIC
import Home from "./public-page/Home";
import Login from "./public-page/Login";
import Signup from "./public-page/Signup";

// CANDIDATE
import CandidateLayout from "./candidate/Candidalayout";
import CandidateDashboard from "./candidate/Dashboard";
import CandidaJobs from "./candidate/cvcandidate.jsx";
import CandidateProfile from "./candidate/CandidateProfile";

// RH
import RHLayout from "./rh/RHLayout";
import Accounts from "./rh/Accountrh";
import RHProfile from "./rh/RHProfile";
import Jobs from "./rh/Jobrh";
import RHDashboard from "./rh/Dashboardrh";
import CreateJobPage from "./rh/job_creation_update/pages/createJobPage.jsx";
import UpdateJobPage from "./rh/job_creation_update/pages/updateJobPage.jsx";
import CandidateSkillsPage from "./rh/CandidateSkillsPage.jsx";

import RequireAuth from "./components/RequireAuth";

function App() {
  useEffect(() => {
    const refreshAccessToken = async () => {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) return;

      try {
        const response = await fetch("/auth/jwt/refresh/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refresh: refreshToken }),
        });
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("access_token", data.access);
        } else {
          localStorage.clear();
          window.location.href = "/login";
        }
      } catch (error) {
        console.error("Token refresh failed:", error);
      }
    };

    refreshAccessToken();

    const interval = setInterval(refreshAccessToken, 55 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        {/* CANDIDATE */}
        <Route path="/candidate" element={<RequireAuth role="candidate" />}>
          <Route element={<CandidateLayout />}>
            <Route index element={<CandidateDashboard />} />
            <Route path="jobs" element={<CandidaJobs />} />
            <Route path="account" element={<CandidateProfile />} />
          </Route>
        </Route>
        {/* RH */}
        <Route path="/rh" element={<RequireAuth role="rh" />}>
          <Route element={<RHLayout />}>
            <Route index element={<RHDashboard />} />
            <Route path="profile" element={<RHProfile />} />
            <Route path="accounts" element={<Accounts />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="create_job" element={<CreateJobPage />} />
            <Route path="update_job/:jobUuid" element={<UpdateJobPage />} />
            <Route path="candidate-skills/:userUuid" element={<CandidateSkillsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
