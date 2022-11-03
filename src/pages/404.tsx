import { Link } from "gatsby";
import * as React from "react";
import Layout from "../components/Layout";

const NotFoundPage = () => {
  return (
    <Layout title="Not Found">
      <div className="page-not-found">
        <h1 className="page-not-found__title">
          Taki wpis jeszcze nie istnieje
        </h1>
        <Link to="/" className="page-not-found__link">
          Wróć na stronę główną
        </Link>
      </div>
    </Layout>
  );
};

export default NotFoundPage;
