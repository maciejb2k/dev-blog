import * as React from "react";
import { graphql, Link, PageProps } from "gatsby";

import Seo from "../components/Seo";
import Layout from "../components/Layout";
import Bio from "../components/Bio";
import Paginate from "../components/Paginate";

type Props = {
  data: Queries.BlogPostsListQuery;
  pageContext: {
    currentPage: number;
    numPages: number;
  };
};

export default function Posts({ data, pageContext }: Props) {
  const { allMarkdownRemark } = data;
  const { numPages, currentPage } = pageContext;
  const posts = allMarkdownRemark.nodes;

  return (
    <Layout>
      <Seo title="Home" />
      <Bio />

      <div className="home-posts">
        {posts.length > 0 ? (
          <ol className="posts-list">
            {posts.map((post: any) => {
              const title = post.frontmatter.title || post.fields.slug;

              return (
                <li key={post.fields.slug} className="posts-list__item">
                  <article
                    className="post-item"
                    itemScope
                    itemType="http://schema.org/Article"
                  >
                    <Link
                      to={post.fields.slug}
                      itemProp="url"
                      className="posts-item__wrapper"
                    >
                      <div className="posts-item__left">
                        <img
                          className="posts-item__thumbnail"
                          src={post.frontmatter.thumbnail.publicURL}
                          alt=""
                        />
                      </div>
                      <div className="posts-item__right">
                        <header className="post-item__header">
                          <h2 className="post-item__title">
                            <span itemProp="headline">{title}</span>
                          </h2>
                          <small className="post-item__date">
                            {post.frontmatter.date} -{" "}
                            {post.frontmatter.readTime} min read
                          </small>
                        </header>
                        <section>
                          <p
                            dangerouslySetInnerHTML={{
                              __html:
                                post.frontmatter.description || post.excerpt,
                            }}
                            itemProp="description"
                            className="post-item__desc"
                          />
                        </section>
                      </div>
                    </Link>
                  </article>
                </li>
              );
            })}
          </ol>
        ) : (
          <p className="no-posts">No posts to display</p>
        )}
        {posts.length > 0 ? (
          <Paginate numPages={numPages} currentPage={currentPage} />
        ) : null}
      </div>
    </Layout>
  );
}

export const BlogPostsList = graphql`
  query BlogPostsList($limit: Int!, $skip: Int!) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      limit: $limit
      skip: $skip
    ) {
      nodes {
        fields {
          slug
        }
        frontmatter {
          date(formatString: "DD-MM-YYYY")
          title
          readTime
          description
          thumbnail {
            publicURL
          }
        }
      }
    }
  }
`;
