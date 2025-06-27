import React from "react";
import iconoHazPlan from "../../assets/iconoHazPlanRedondo.png";

const Logo = () => {
  return (
    <>
      <img
        src={iconoHazPlan}
        alt="Logo-haz-plan"
        style={{ width: 60, height: 60, borderRadius: "50%" }}
      />
    </>
  );
};
export default Logo;
