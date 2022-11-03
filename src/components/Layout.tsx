import React, { useEffect } from "react";

import { useStaticQuery, graphql, Link } from "gatsby";

import Header from "./Header";
import Footer from "./Footer";

const Layout = (props: any) => {
  const data = useStaticQuery(graphql`
    query LayoutQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  return (
    <div className="page-wrapper">
      <Header />
      <main className="page-main">{props.children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
