import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div>
      <h2>404 - Not Found</h2>
      <p>This page does not exist.</p>
      <Link to="/">Back to Home</Link>
    </div>
  );
}