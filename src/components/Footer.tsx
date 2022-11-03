import * as React from "react";

const Footer = () => {
  return (
    <footer className="page-footer">
      © {new Date().getFullYear()} <b>Maciej Biel</b>
    </footer>
  );
};

export default Footer;
