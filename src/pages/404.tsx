import { Link } from "gatsby";
import * as React from "react";
import Layout from "../components/Layout";

const NotFoundPage = () => {
  return (
    <Layout>
      <div className="page-not-found">
        <h1 className="page-not-found__title">Page not found</h1>
        <Link to="/" className="page-not-found__link">
          Return to home page
        </Link>
      </div>
    </Layout>
  );
};

export default NotFoundPage;
