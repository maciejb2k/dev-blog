import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  siteMetadata: {
    siteUrl: "https://dev-blog.maciejbiel.pl",
    title: `Dev Blog`,
    titleTemplate: "%s · dev-blog.maciejbiel.pl",
    author: `Maciej Biel`,
    description: `My personal blog about software development and other stuff`,
    url: "https://dev-blog.maciejbiel.pl", // No trailing slash allowed!
    image: "/og-image.jpg", // Path to the image placed in the 'static' folder, in the project's root directory.
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    "gatsby-plugin-image",
    "gatsby-plugin-sitemap",
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-plugin-sass",
      options: {
        cssLoaderOptions: {
          modules: {
            exportLocalsConvention: "camelCaseOnly",
          },
        },
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./src/images/",
      },
      __key: "images",
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "pages",
        path: "./src/pages/",
      },
      __key: "pages",
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `./content/blog/`,
        name: `blog`,
      },
      __key: "blog",
    },
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: `gatsby-remark-images`,
            options: {
              // It's important to specify the maxWidth (in pixels) of
              // the content container as this plugin uses this as the
              // base for generating different widths of each image.
              maxWidth: 590,
            },
          },
          {
            resolve: `gatsby-remark-highlight-code`,
            options: {
              lineNumbers: false,
            },
          },
        ],
      },
    },
    {
      resolve: "gatsby-plugin-web-font-loader",
      options: {
        google: {
          families: ["Roboto Slab:400,600", "Roboto:600"],
        },
      },
    },
  ],
};

export default config;
