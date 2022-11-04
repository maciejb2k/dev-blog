import React, { ReactNode } from "react";

import Header from "./Header";
import Footer from "./Footer";

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div className="page-wrapper">
      <Header />
      <main className="page-main">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
