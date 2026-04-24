import { useState } from "react";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import { socialLinks } from "../data/sociallinks";

function ContactMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const getIcon = (name) => {
    switch (name) {
      case "Instagram":
        return <FaInstagram />;
      case "LinkedIn":
        return <FaLinkedin  />;
      case "Facebook":
        return <FaFacebook />;
      default:
        return null;
    }
  };

  return (
    <div
      className="contact-menu"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <div className={`contact-stack ${isOpen ? "open" : ""}`}>
        <div className="contact-label">Contact us</div>

        <div className="contact-icons">
          {socialLinks.map((item) => (
            <a
              key={item.id}
              className="contact-icon"
              href={item.url}
              target={item.name !== "Mail" ? "_blank" : undefined}
              rel={item.name !== "Mail" ? "noreferrer" : undefined}
              aria-label={item.name}
            >
              {getIcon(item.name)}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ContactMenu;