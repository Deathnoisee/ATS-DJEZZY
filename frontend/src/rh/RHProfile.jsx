import React, { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import Switch from "../switch/Switch";
import "../styles/rh/accountrh.css";

const emptyProfile = {
  username: "",
  last_name: "",
  email: "",
};

function RHProfile() {
  const outletContext = useOutletContext() || {};
  const { theme = "dark", toggleTheme, profile: layoutProfile, setProfile } = outletContext;
  const navigate = useNavigate();
  const [profile, setLocalProfile] = useState(layoutProfile || null);
  const [form, setForm] = useState(emptyProfile);
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_role");
    navigate("/login");
  };

  useEffect(() => {
    const loadProfile = async () => {
      if (layoutProfile) {
        setLocalProfile(layoutProfile);
        setForm({
          username: layoutProfile.username || "",
          last_name: layoutProfile.last_name || "",
          email: layoutProfile.email || "",
        });
        return;
      }

      setLoading(true);
      try {
        const response = await fetch("/auth/users/me/", {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders(),
          },
        });

        if (!response.ok) {
          throw new Error("Unable to load your profile.");
        }

        const data = await response.json();
        setLocalProfile(data);
        setForm({
          username: data.username || "",
          last_name: data.last_name || "",
          email: data.email || "",
        });
      } catch (err) {
        setError(err.message || "Unable to load your profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [layoutProfile]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setProfileError("");
    setProfileSuccess("");
  };

  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    setPasswordError("");
    setPasswordSuccess("");
  };

  const togglePasswordForm = () => {
    setShowPasswordForm((current) => !current);
    setPasswordError("");
    setPasswordSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setProfileError("");
    setProfileSuccess("");

    try {
      const response = await fetch("/auth/users/me/", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(form),
      });

      const contentType = response.headers.get("content-type") || "";
      const responseData = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        const message =
          responseData?.detail ||
          responseData?.message ||
          Object.values(responseData || {})[0] ||
          "Unable to update your profile.";
        throw new Error(typeof message === "string" ? message : JSON.stringify(message));
      }

      const updatedProfile = responseData && typeof responseData === "object" ? responseData : { ...profile, ...form };
      setLocalProfile(updatedProfile);
      if (setProfile) {
        setProfile(updatedProfile);
      }
      setProfileSuccess("Profile updated successfully.");
    } catch (err) {
      setProfileError(err.message || "Unable to update your profile.");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChangeSubmit = async (event) => {
    event.preventDefault();
    setChangingPassword(true);
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordForm.new_password !== passwordForm.confirm_password) {
      setPasswordError("Passwords do not match.");
      setChangingPassword(false);
      return;
    }

    try {
      const response = await fetch("/auth/users/set_password/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(passwordForm),
      });

      const contentType = response.headers.get("content-type") || "";
      const responseData = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        const message =
          responseData?.current_password?.[0] ||
          responseData?.new_password?.[0] ||
          responseData?.detail ||
          responseData?.message ||
          Object.values(responseData || {})[0] ||
          "Unable to change password.";
        throw new Error(typeof message === "string" ? message : JSON.stringify(message));
      }

      setPasswordSuccess("Password changed successfully.");
      setPasswordForm({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
    } catch (err) {
      setPasswordError(err.message || "Unable to change password.");
    } finally {
      setChangingPassword(false);
    }
  };

  return (
    <section className={`account-rh ${theme}-theme`}>
      <header className="account-header">
        <div className={`welcome-content ${theme}-theme`}>
          <p>My RH profile</p>
        </div>

        {toggleTheme && (
          <Switch
            className="account-theme-switch"
            checked={theme === "dark"}
            onChange={toggleTheme}
          />
        )}
      </header>

      <section className="profile-card">
        <h2>Account information</h2>
        {loading && <p>Loading profile...</p>}
        {!loading && profile && (
          <div className="profile-grid">
            <div>
              <span>Username</span>
              <strong>{profile.username || "-"}</strong>
            </div>
            <div>
              <span>Email</span>
              <strong>{profile.email || "-"}</strong>
            </div>
            <div>
              <span>Last name</span>
              <strong>{profile.last_name || "-"}</strong>
            </div>
            <div>
              <span>Role</span>
              <strong>{profile.isRH ? "RH" : "Candidate"}</strong>
            </div>
          </div>
        )}
      </section>

      <section className="create-rh-form">
        <h2>Edit my profile</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Username
            <input name="username" value={form.username} onChange={handleChange} required />
          </label>
          <label>
            Last name
            <input name="last_name" value={form.last_name} onChange={handleChange} required />
          </label>
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </label>
          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
        {profileError && <div className="form-error profile-form-message">{profileError}</div>}
        {profileSuccess && <div className="form-success profile-form-message">{profileSuccess}</div>}
      </section>

      <section className="password-reset-form">
        <h2>Change password</h2>
        <button type="button" className="password-reset-toggle-button" onClick={togglePasswordForm}>
          {showPasswordForm ? "Hide password form" : "Change password"}
        </button>

        {showPasswordForm && (
          <>
            <form onSubmit={handlePasswordChangeSubmit}>
              <label>
                Current password
                <input
                  name="current_password"
                  type="password"
                  value={passwordForm.current_password}
                  onChange={handlePasswordChange}
                  required
                />
              </label>
              <label>
                New password
                <input
                  name="new_password"
                  type="password"
                  value={passwordForm.new_password}
                  onChange={handlePasswordChange}
                  required
                  minLength={8}
                />
              </label>
              <label>
                Confirm password
                <input
                  name="confirm_password"
                  type="password"
                  value={passwordForm.confirm_password}
                  onChange={handlePasswordChange}
                  required
                  minLength={8}
                />
              </label>
              <button type="submit" disabled={changingPassword}>
                {changingPassword ? "Updating..." : "Update password"}
              </button>
            </form>
            {passwordError && <div className="form-error password-form-message">{passwordError}</div>}
            {passwordSuccess && <div className="form-success password-form-message">{passwordSuccess}</div>}
          </>
        )}
      </section>

      <footer className="account-footer">
        <Link to="/rh/accounts">Go to account management</Link>
        <button type="button" className="profile-logout-button" onClick={handleLogout}>
          Log out
        </button>
      </footer>
    </section>
  );
}

export default RHProfile;