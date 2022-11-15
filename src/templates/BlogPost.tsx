import * as React from "react";
import { graphql, Link, PageProps } from "gatsby";

import Seo from "../components/Seo";
import Layout from "../components/Layout";
import Bio from "../components/Bio";

import { defineCustomElements as deckDeckGoHighlightElement } from "@deckdeckgo/highlight-code/dist/loader";
deckDeckGoHighlightElement();

type BlogPostBySlugQuery = {
  readonly site: {
    readonly siteMetadata: { readonly title: string | null } | null;
  } | null;
  readonly markdownRemark: {
    readonly id: string;
    readonly excerpt: string | null;
    readonly html: string;
    readonly frontmatter: {
      readonly title: string;
      readonly date: string;
      readonly description: string;
      readonly readTime: string | null;
      readonly thumbnail: { readonly publicURL: string };
    };
    readonly fields: { readonly slug: string | null } | null;
  };
};

export default function BlogPostTemplate({
  data,
}: PageProps<BlogPostBySlugQuery>) {
  const { markdownRemark } = data;
  const { frontmatter, html } = markdownRemark;

  return (
    <Layout>
      <Seo
        title={frontmatter.title}
        description={frontmatter.description}
        article={true}
        thumbnail={frontmatter.thumbnail.publicURL}
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

export const BlogPostBySlug = graphql`
  query BlogPostBySlug($id: String!) {
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
  }
`;
