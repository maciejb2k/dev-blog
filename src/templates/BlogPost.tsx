import { graphql, Link } from "gatsby";
import * as React from "react";

import Seo from "../components/Seo";
import Layout from "../components/Layout";
import Bio from "../components/Bio";
import { defineCustomElements as deckDeckGoHighlightElement } from "@deckdeckgo/highlight-code/dist/loader";
deckDeckGoHighlightElement();

export default function BlogPostTemplate(props: any) {
  const { markdownRemark } = props.data;
  const { frontmatter, html } = markdownRemark;

  return (
    <Layout blogWidth={"700px"}>
      <Seo
        title={frontmatter.title}
        description={frontmatter.description}
        article={true}
      />
      <article className="blog-post">
        <header className="blog-post__header">
          <img
            className="blog-post__thumbnail"
            src={frontmatter.thumbnail.publicURL}
            alt=""
          />
          <Link to="/" className="blog-post__return">
            Return to home page
          </Link>
          <h1 className="blog-post__title" itemProp="headline">
            {frontmatter.title}
          </h1>
          <p className="blog-post__date">
            {frontmatter.date} - {frontmatter.readTime} min read
          </p>
        </header>
        {html ? (
          <section
            dangerouslySetInnerHTML={{ __html: html }}
            itemProp="articleBody"
            className="markdown-body"
          />
        ) : (
          <p className="blog-post__empty">No content found</p>
        )}
      </article>
      <Bio />
    </Layout>
  );
}

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        location
        date(formatString: "DD-MM-YYYY")
        description
        readTime
        thumbnail {
          publicURL
        }
      }
      fields {
        slug
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`;
