
import bg from "../assets/image/hero.jpg";
import logoImg from "../assets/image/logo1.png";
import { Link } from "react-router-dom";
import ProjectCarousel from "./ProjectCarousel";
import ContactMenu from "./contactmenu";
import "../styles/Home.css";


const PhoneIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="rgba(255,255,255,0.9)"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.86 19.86 0 0 1 3 5.18 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.72c.12.99.36 1.95.72 2.86a2 2 0 0 1-.45 2.11L9.91 10.09a16 16 0 0 0 6 6l1.4-1.4a2 2 0 0 1 2.11-.45c.91.36 1.87.6 2.86.72A2 2 0 0 1 22 16.92z" />
  </svg>
);

const MailIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="rgba(255,255,255,0.9)"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);

const LinkedInIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="rgba(255,255,255,0.9)"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="2" />
    <path d="M16 11.5c0-1.38.56-2.5 2-2.5s2 1.12 2 2.5V18" />
    <path d="M8 9v9" />
    <path d="M8 7a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
  </svg>
);

const ContactButton = ({
  phone = "tel:+1234567890",
  email = "mailto:you@example.com",
  linkedin = "https://linkedin.com/in/yourprofile",
}) => (
  <div className="contact-wrap">
    <a className="contact-btn" href={phone}>
      contact us
    </a>
    <div className="icons-tray">
      <a className="icon-link" href={phone} title="Phone">
        <PhoneIcon />
      </a>
      <a className="icon-link" href={email} title="Email">
        <MailIcon />
      </a>
      <a
        className="icon-link"
        href={linkedin}
        title="LinkedIn"
        target="_blank"
        rel="noreferrer"
      >
        <LinkedInIcon />
      </a>
    </div>
  </div>
);

function Home() {


  return (
    <section className="Home-page">
      <div className="logo1">
        <img src={logoImg} alt="Logo" className="logo-img1" />
      </div>
      <div className="navbar">
        <a className="btn home" href="/">
          Home
        </a>
        <Link className="btn login" to="/login">
          Login
        </Link>

        <Link className="btn signup" to="/signup">
          Sign Up
        </Link>
        <Link className="btn create-job" to="/rh/create_job">
          Create Job
        </Link>
      </div>
      <div className="nav-contact">
        <ContactMenu />
      </div>
      <section
        className="hero"

        style={{ backgroundImage: `url(${bg})` }}
      ><div className="hero-content">
          <h1 className="welcomeh">Welcome to TalentBridge</h1>
        </div></section>

      <section className="content-below">
        <ProjectCarousel />
      </section>
    </section>
  );
}

export default Home;

