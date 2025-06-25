import { Link } from "react-router-dom";
import Logo from "../navigation/Logo";
import "../../styles/LogoFijo.css";

export default function LogoFijo() {
  return (
    <div className="logo-fijo">
      <Link to="/">
        <Logo />
      </Link>
    </div>
  );
}
