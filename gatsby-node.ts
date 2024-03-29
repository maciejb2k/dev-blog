const path = require(`path`);
const { createFilePath } = require(`gatsby-source-filesystem`);

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  // Define a template for blog post
  const blogPost = path.resolve(`./src/templates/BlogPost.tsx`);
  const postsList = path.resolve(`./src/templates/Posts.tsx`);

  // Get all markdown blog posts sorted by date
  const result = await graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: ASC }
          limit: 1000
        ) {
          nodes {
            id
            fields {
              slug
            }
          }
        }
      }
    `
  );

  // Raise error if there are any
  if (result.errors) {
    reporter.panicOnBuild(
      `There was an error loading your blog posts`,
      result.errors
    );

    return;
  }

  // Create all blog posts page with pagination
  const posts = result.data.allMarkdownRemark.nodes;
  const postsPerPage = 20;
  const numPages = Math.ceil(posts.length / postsPerPage);

  Array.from({ length: numPages }).forEach((_, i) => {
    const firstPage = i === 0;
    const currentPage = i + 1;

    // Creates under given url
    createPage({
      path: firstPage ? "/" : `/page/${currentPage}`,
      component: postsList,
      context: {
        limit: postsPerPage,
        skip: i * postsPerPage,
        numPages,
        currentPage,
      },
    });
  });

  // Create blog posts pages
  // But only if there's at least one markdown file found at "content/blog" (defined in gatsby-config.js)
  // `context` is available in the template as a prop and as a variable in GraphQL
  if (posts.length > 0) {
    posts.forEach((post) => {
      createPage({
        path: post.fields.slug,
        component: blogPost,
        context: {
          id: post.id,
        },
      });
    });
  }
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode });

    createNodeField({
      name: `slug`,
      node,
      value,
    });
  }
};

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;

  // Explicitly define the siteMetadata {} object
  // This way those will always be defined even if removed from gatsby-config.js

  // Also explicitly define the Markdown frontmatter
  // This way the "MarkdownRemark" queries will return `null` even when no
  // blog posts are stored inside "content/blog" instead of returning an error
  createTypes(`
    type SiteSiteMetadata {
      title: String
      author: String
      siteUrl: String
      social: Social
    }

    type Author {
      name: String
      summary: String
      selfIntroduction: String
    }

    type Social {
      git: String
      instagram: String
      twitter: String
      linkdein: String
      facebook: String
      mail: String
    }

    type MarkdownRemark implements Node {
      frontmatter: Frontmatter
      fields: Fields
    }

    type Frontmatter {
      title: String
      description: String
      thumbnail: File @fileByRelativePath
      readTime: String
      author: String
      authorPhoto: File @fileByRelativePath
      date: Date @dateformat
    }

    type Fields {
      slug: String
    }
  `);
};
