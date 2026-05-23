 import { useEffect, useRef, useState } from "react";
import "../styles/ProjectCarousel.css";
import proj1 from "../assets/image/proj1.png";
import proj2 from "../assets/image/proj2.png";
import proj3 from "../assets/image/proj3.jpg";
import proj4 from "../assets/image/proj4.jpg";
import proj5 from "../assets/image/proj5.jpg";
import proj6 from "../assets/image/proj6.jpg";
import proj7 from "../assets/image/proj7.jpg";

const images = [
  { src: proj1, alt: "exterior" },
  { src: proj2, alt: "interior" },
  { src: proj3, alt: "living room" },
  { src: proj4, alt: "kitchen" },
  { src: proj5, alt: "community" },
  { src: proj6, alt: "street view" },
  { src: proj7, alt: "tower" },
];

const stats = [
  { target: 24,    suffix: "+", label: "Annes d'expérience" },
  { target: 17, suffix: "M", label: "client satfait" },
  { target: 300,   suffix: "+",  label: "points de vente" },
  { target: 36,    suffix:  " milliards ",  label: "investissements" },
];

function getCardStyle(index, current, total) {
  const half = Math.floor(total / 2);
  let offset = (index - current + total) % total;
  const norm = offset > half ? offset - total : offset;
  const t = norm / half;
  const tx = t *900;
  const rotY = t * 52;
  const rotZ = -t * 8;
  const scale = 1 - Math.abs(t) * 0.18;
  const tz = -Math.abs(t) * 80;
  return {
    transform: `translateX(${tx}px) translateZ(${tz}px) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale(${scale})`,
    zIndex: Math.round((1 - Math.abs(t)) * 10),
  };
}

function useCountUp(target, duration = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const steps = 80;
        let step = 0;
        const timer = setInterval(() => {
          step++;
          const eased = 1 - Math.pow(1 - step / steps, 3);
          setCount(Math.round(eased * target));
          if (step >= steps) { setCount(target); clearInterval(timer); }
        }, duration / steps);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return { count, ref };
}

function StatItem({ target, suffix, label }) {
  const { count, ref } = useCountUp(target);
  return (
    <div className="stat-item" ref={ref}>
      <span className="stat-number">{count}{suffix}</span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

export default function ProjectCarousel() {
  const [current, setCurrent] = useState(0);
  const N = images.length;

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % N), 2200);
    return () => clearInterval(t);
  }, [N]);

  return (
    <section className="carousel-section">
      <div className="carousel-track">
        {images.map((img, i) => (
          <div key={i} className="carousel-card" style={getCardStyle(i, current, N)}>
            <img src={img.src} alt={img.alt} draggable={false} />
          </div>
        ))}
      </div>

      <div className="stats-row">
        {stats.map((s, i) => (
          <StatItem key={i} {...s} />
        ))}
      </div>
    </section>
  );
}