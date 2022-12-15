import React from "react";
import { Link } from "react-router-dom";

function index() {
  return (
    <div className="homepage-container content-layout rounded">
      Please visit <Link to="/analytics"> Analytics Page</Link> to see the
      assignment
    </div>
  );
}

export default index;
