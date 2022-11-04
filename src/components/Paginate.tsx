import * as React from "react";
import { Link } from "gatsby";

type PaginateProps = {
  currentPage: number;
  numPages: number;
};

const Paginate = (props: PaginateProps) => {
  const { numPages, currentPage } = props;

  return (
    <div className="pagination">
      {Array.from({ length: numPages }, (_, i) => (
        <Link
          key={`pagination-number${i + 1}`}
          to={i === 0 ? "/" : `/page/${i + 1}`}
          className={
            i + 1 === currentPage
              ? "pagination__link pagination__link--active"
              : "pagination__link"
          }
        >
          {i + 1}
        </Link>
      ))}
    </div>
  );
};

export default Paginate;
