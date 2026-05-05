import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/rh/accountrh.css";

const initialForm = {
  username: "",
  last_name: "",
  email: "",
  password: "",
  phone: "",
};

function Accountrh() {
  const [theme, setTheme] = useState("dark");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [accounts, setAccounts] = useState([]);
  const [rhAccounts, setRhAccounts] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

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
        throw new Error("Impossible de charger les comptes.");
      }
      const data = await response.json();
      setAccounts(data);
    } catch (err) {
      setError(err.message || "Erreur lors du chargement des comptes.");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError("");
    setSuccess("");
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
          "Erreur lors de la création du compte RH.";
        throw new Error(typeof message === "string" ? message : JSON.stringify(message));
      }

      setRhAccounts((prev) => [...prev, data]);
      setForm(initialForm);
      setSuccess("Compte RH créé avec succès.");
      fetchAccounts();
    } catch (err) {
      setError(err.message || "Erreur lors de la création du compte RH.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={`account-rh ${theme}-theme`}>
      <header className="account-header">
        <div className={`welcome-content ${theme}-theme`}>
          <p>Welcome, recruiter! Your account will appear here.</p>
        </div>

        <div className="search-wrapper">
          <input
            className="seach"
            id="seach label"
            type="text"
            placeholder="Search..."
          />
        </div>

        <label className="switch">
          <input
            type="checkbox"
            className="input__check"
            checked={theme === "dark"}
            onChange={toggleTheme}
          />
          <span className="slider"></span>
        </label>
      </header>

      <div className="account-actions">
        <button
          type="button"
          className="create-account"
          onClick={() => setShowForm((current) => !current)}
        >
          {showForm ? "Masquer le formulaire RH" : "Créer un compte RH"}
        </button>
      </div>

      {showForm && (
        <section className="create-rh-form">
          <h2>Créer un compte RH</h2>
          <form onSubmit={handleCreateRH}>
            <label>
              Nom d'utilisateur
              <input
                name="username"
                value={form.username}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Nom
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
              Mot de passe
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
              Téléphone
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
            </label>
            <button type="submit" disabled={loading}>
              {loading ? "Création..." : "Créer le compte RH"}
            </button>
          </form>
          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}
        </section>
      )}

      <section className="accounts-list">
        <h2>Comptes candidats</h2>
        {accounts.length === 0 ? (
          <p>Aucun compte candidat trouvé.</p>
        ) : (
          <ul>
            {accounts.map((user) => (
              <li key={user.uuid || user.email}>
                <strong>{user.username}</strong> — {user.email}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="accounts-list">
        <h2>Comptes RH créés</h2>
        {rhAccounts.length === 0 ? (
          <p>Aucun compte RH créé ici pour le moment.</p>
        ) : (
          <ul>
            {rhAccounts.map((user, index) => (
              <li key={user.uuid || `${user.email}-${index}`}>
                <strong>{user.username}</strong> — {user.email}
              </li>
            ))}
          </ul>
        )}
      </section>

      <footer className="account-footer">
        <Link to="/rh">Retour au tableau de bord RH</Link>
      </footer>
    </section>
  );
}

export default Accountrh;
