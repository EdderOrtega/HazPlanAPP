import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import "../styles/dashboardInicio.css";

function StatCard({ icon, number, label, duration = 1200, delay = 0 }) {
  const [displayNumber, setDisplayNumber] = useState(100);
  const ref = useRef();

  useEffect(() => {
    let startTimestamp = null;
    let raf;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Animar de 100 hacia abajo hasta el número real
      const value = Math.round(100 - (100 - number) * progress);
      setDisplayNumber(value);
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      } else {
        setDisplayNumber(number);
      }
    };
    const timeout = setTimeout(() => {
      raf = requestAnimationFrame(step);
    }, delay);
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [number, duration, delay]);

  return (
    <div className="stat-simple animate-statcard">
      <div className="stat-icon">{icon}</div>
      <div className="stat-number">{displayNumber}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

StatCard.propTypes = {
  icon: PropTypes.node.isRequired,
  number: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  duration: PropTypes.number,
  delay: PropTypes.number,
};

export default StatCard;
