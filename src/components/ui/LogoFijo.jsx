import { Link } from "react-router-dom";
import Logo from "../navigation/Logo";
import "../../styles/logoFijo.css"; // VERCEL DEPLOY - case sensitivity fix

export default function LogoFijo() {
  return (
    <div className="logo-fijo">
      <Link to="/">
        <Logo />
      </Link>
    </div>
  );
}
