import React, { useEffect, useState } from "react";
import { Link, useOutletContext } from "react-router-dom";
import Switch from "../switch/Switch";
import "../styles/rh/accountrh.css";

const initialForm = {
  username: "",
  last_name: "",
  email: "",
  password: "",
  phone: "",
};

const editableUserFields = {
  username: "",
  last_name: "",
  email: "",
};

function Accountrh() {
  const outletContext = useOutletContext() || {};
  const { theme = "dark", toggleTheme } = outletContext;
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [accounts, setAccounts] = useState([]);
  const [rhAccounts, setRhAccounts] = useState([]);
  const [editingUuid, setEditingUuid] = useState(null);
  const [editForm, setEditForm] = useState(editableUserFields);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [savingUuid, setSavingUuid] = useState(null);
  const [deletingUuid, setDeletingUuid] = useState(null);
  const [isSuperuser, setIsSuperuser] = useState(false);

  useEffect(() => {
    fetchAccounts();
    fetchProfile();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("access_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchAccounts = async () => {
    try {
      const response = await fetch("/authentication/hr/users", {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      });
      if (!response.ok) {
        throw new Error("Unable to load accounts.");
      }
      const data = await response.json();
      setAccounts(data);
    } catch (err) {
      setError(err.message || "Error while loading accounts.");
    }
  };

  const fetchProfile = async () => {
    try {
      const response = await fetch("/auth/users/me/", {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      });
      if (!response.ok) {
        setIsSuperuser(false);
        return;
      }
      const profile = await response.json();
      setIsSuperuser(Boolean(profile.is_superuser));
    } catch (err) {
      setIsSuperuser(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
  };

  const startEditing = (user) => {
    setEditingUuid(user.uuid);
    setEditForm({
      username: user.username || "",
      last_name: user.last_name || "",
      email: user.email || "",
    });
    setError("");
    setSuccess("");
  };

  const cancelEditing = () => {
    setEditingUuid(null);
    setEditForm(editableUserFields);
    setError("");
  };

  const handleCreateRH = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/authentication/auth/register/hr/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(form),
      });

      const contentType = response.headers.get("content-type") || "";
      let data;
      if (contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        throw new Error(`Backend returned non-JSON response: ${text}`);
      }

      if (!response.ok) {
        const message =
          data?.detail ||
          data?.message ||
          Object.values(data || {})[0] ||
            "Unable to create the RH account.";
        throw new Error(typeof message === "string" ? message : JSON.stringify(message));
      }

      setRhAccounts((prev) => [...prev, data]);
      setForm(initialForm);
        setSuccess("RH account created successfully.");
      fetchAccounts();
    } catch (err) {
        setError(err.message || "Unable to create the RH account.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (event) => {
    event.preventDefault();
    if (!editingUuid) return;

    setSavingUuid(editingUuid);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/authentication/hr/update/${editingUuid}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(editForm),
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
          "Unable to update the account.";
        throw new Error(typeof message === "string" ? message : JSON.stringify(message));
      }

      setSuccess("Account updated successfully.");
      setEditingUuid(null);
      setEditForm(editableUserFields);
      fetchAccounts();
    } catch (err) {
      setError(err.message || "Unable to update the account.");
    } finally {
      setSavingUuid(null);
    }
  };

  const handleDeleteUser = async (user) => {
    const confirmed = window.confirm(
      `Supprimer le compte ${user.username || user.email || "sélectionné"} ?`,
    );
    if (!confirmed) return;

    setDeletingUuid(user.uuid);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/authentication/hr/delete/${user.uuid}/`, {
        method: "DELETE",
        headers: {
          ...getAuthHeaders(),
        },
      });

      if (!response.ok) {
        const message = await response.text().catch(() => "");
        throw new Error(message || "Unable to delete the account.");
      }

      setSuccess("Account deleted successfully.");
      setAccounts((prev) => prev.filter((item) => item.uuid !== user.uuid));
      if (editingUuid === user.uuid) {
        cancelEditing();
      }
    } catch (err) {
      setError(err.message || "Unable to delete the account.");
    } finally {
      setDeletingUuid(null);
    }
  };

  return (
    <section className={`account-rh ${theme}-theme`}>
      <header className="account-header">
        <div className={`welcome-content ${theme}-theme`}>
          <p>HR and candidate account management.</p>
        </div>
        
        {toggleTheme && (
            <Switch
              className="account-theme-switch"
              checked={theme === "dark"}
              onChange={toggleTheme}
            />
        )}
      </header>
          

      {isSuperuser && (
        <div className="account-actions">
          <button
            type="button"
            className="create-account"
            onClick={() => setShowForm((current) => !current)}
          >
            {showForm ? "Hide RH form" : "Create RH account"}
          </button>
        </div>
      )}

      {showForm && (
        <section className="create-rh-form">
          <h2>Create an RH account</h2>
          <form onSubmit={handleCreateRH}>
            <label>
              Username
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Last name
              <input
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Email
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Password
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                minLength={8}
              />
            </label>
            <label>
              Phone
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
            </label>
            <button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create RH account"}
            </button>
          </form>
          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}
        </section>
      )}

      <section className="accounts-list">
        <h2>Candidate accounts</h2>
        {accounts.length === 0 ? (
          <p>No candidate accounts found.</p>
        ) : (
          <div className="accounts-grid">
            {accounts.map((user) => {
              const isEditing = editingUuid === user.uuid;
              return (
                <article key={user.uuid || user.email} className="account-card">
                  {!isEditing ? (
                    <>
                      <div className="account-card-main">
                        <strong>{user.username || "-"}</strong>
                        <span>{user.email || "-"}</span>
                        {user.last_name && <small>{user.last_name}</small>}
                      </div>
                      <div className="account-card-actions">
                        <button type="button" onClick={() => startEditing(user)}>
                          Edit
                        </button>
                        <button
                          type="button"
                          className="delete-action"
                          onClick={() => handleDeleteUser(user)}
                          disabled={deletingUuid === user.uuid}
                        >
                          {deletingUuid === user.uuid ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </>
                  ) : (
                    <form className="account-edit-form" onSubmit={handleUpdateUser}>
                      <label>
                        Username
                        <input
                          name="username"
                          value={editForm.username}
                          onChange={handleEditChange}
                          required
                        />
                      </label>
                      <label>
                        Last name
                        <input
                          name="last_name"
                          value={editForm.last_name}
                          onChange={handleEditChange}
                          required
                        />
                      </label>
                      <label>
                        Email
                        <input
                          name="email"
                          type="email"
                          value={editForm.email}
                          onChange={handleEditChange}
                          required
                        />
                      </label>
                      <div className="account-card-actions">
                        <button type="submit" disabled={savingUuid === user.uuid}>
                          {savingUuid === user.uuid ? "Saving..." : "Save"}
                        </button>
                        <button type="button" onClick={cancelEditing}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      

      <footer className="account-footer">
        <Link to="/rh">Back to RH dashboard</Link>
      </footer>
    </section>
  );
}

export default Accountrh;
