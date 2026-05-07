import { useState, useEffect } from "react";
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
        <Route path="/candidate" element={<CandidateLayout />}>
          <Route index element={<CandidateDashboard />} />
          <Route path="accounts" element={<CandidaAccounts />} />
          <Route path="jobs" element={<CandidaJobs />} />
        </Route>
        -{/* RH */}
        <Route path="/rh" element={<RHLayout />}>
          <Route index element={<RHDashboard />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="create_job" element={<CreateJobPage />} />
          <Route path="update_job/:jobUuid" element={<UpdateJobPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
