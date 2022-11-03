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
          My name is <b>Maciej Biel</b>. I am {new Date().getFullYear() - 2000}{" "}
          years old student from Poland curious about computer science.
        </p>
        <p className="page-bio__about">
          You probably won't find anything innovative or revealing here. I want
          this blog to describe what I did or learned today. These posts should
          be useful to version of me from yesterday.
        </p>
      </div>
    </div>
  );
};

export default Bio;
