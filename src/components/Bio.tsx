import { StaticImage } from "gatsby-plugin-image";
import * as React from "react";

const Bio = () => {
  return (
    <div className="page-bio">
      <StaticImage
        className="page-bio__photo"
        src="../images/avatar.jpg"
        alt="profile picture"
      />
      <div className="page_bio__text">
        <p className="page-bio__about">
          I'm just curious about computer science, mainly web development.
        </p>
        <p className="page-bio__about">
          I want this blog to describe what I did or learned today. These posts
          should be useful to a version of me from yesterday.
        </p>
      </div>
    </div>
  );
};

export default Bio;
