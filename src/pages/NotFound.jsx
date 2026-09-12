import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <section className="not-found">
      <div>
        <div className="not-found-number">404</div>

        <h1>Oops!</h1>

        <p>The page you are looking for does not exist.</p>

        <Link to="/" className="btn btn-primary">
          Go Home
        </Link>
      </div>
    </section>
  );
}

export default NotFound;
