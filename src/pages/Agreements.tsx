import { Link } from "@tanstack/react-router";
import Protector from "../routes/Protector";

const Agreements = () => {
  return (
    <Protector>
      <h1 className="text-red-400">Agreements</h1>
      <p>
        <Link to="/">Home Page</Link>
      </p>
    </Protector>
  );
};

export default Agreements;
