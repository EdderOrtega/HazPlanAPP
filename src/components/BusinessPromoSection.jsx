import React from "react";
import GTAAnimatedElement from "./effects/GTAAnimatedElement";
import "../styles/businessPromoSection.css";

const BusinessPromoSection = () => {
  return (
    <section className="business-promo-section">
      <div className="container">
        <GTAAnimatedElement
          animationType="fadeInUp"
          delay={0.1}
          triggerStart="top 120%"
          className="business-badge"
        >
          <div className="badge">
            <span className="badge-text">PRÓXIMAMENTE</span>
          </div>
        </GTAAnimatedElement>

        <GTAAnimatedElement
          animationType="zoomIn"
          delay={0.3}
          triggerStart="top 120%"
          className="business-title"
        >
          <h2>
            <span className="highlight-text">Crea eventos sorpresa</span>
            <br />
            con <span className="gradient-text">HazPlan Business</span>
          </h2>
        </GTAAnimatedElement>

        <GTAAnimatedElement
          animationType="slideInLeft"
          delay={0.5}
          triggerStart="top 120%"
          className="business-benefits"
        >
          <div className="benefits-list">
            <div className="benefit-item">
              <span className="benefit-icon">🎯</span>
              <span>Segmentación avanzada</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">📊</span>
              <span>Analytics detallado</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-icon">🚀</span>
              <span>Promoción premium</span>
            </div>
          </div>
        </GTAAnimatedElement>

        <GTAAnimatedElement
          animationType="flipIn"
          delay={0.7}
          triggerStart="top 120%"
          className="business-cta"
        >
          <div className="cta-buttons">
            <button className="btn-primary">Lista de espera</button>
            <button className="btn-secondary">Más información</button>
          </div>
        </GTAAnimatedElement>
      </div>
    </section>
  );
};

export default BusinessPromoSection;
