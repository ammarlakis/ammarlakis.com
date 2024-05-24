const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');

exports.onCreateNode = ({ node, actions, getNode }: { node: any, actions: any, getNode: any }) => {
  const { createNodeField } = actions;
  if (node.internal.type === 'MarkdownRemark') {
    const slug = createFilePath({ node, getNode, basePath: 'pages' });
    createNodeField({
      node,
      name: 'slug',
      value: slug,
    });
  }
};

exports.createPages = async ({ graphql, actions }: { graphql: any, actions: any}) => {
  const { createPage } = actions;
  const result = await graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              tags
            }
          }
        }
      }
    }
  `);

  if (result.errors) {
    console.error(result.errors);
    throw result.errors;
  }

  const blogPostTemplate = path.resolve('src/pages/post.tsx');

  result.data.allMarkdownRemark.edges.forEach(({ node }: { node: any}) => {
    createPage({
      path: node.fields.slug,
      component: blogPostTemplate,
      context: {
        slug: node.fields.slug,
      },
    });
  });

  let tags: string[] = [];
  result.data.allMarkdownRemark.edges.forEach(({ node }: { node: any }) => {
    if (node.frontmatter.tags) {
      tags = tags.concat(node.frontmatter.tags);
    }
  });

  tags = [...new Set(tags)];

  tags.forEach(tag => {
    createPage({
      path: `/tags/${tag}/`,
      component: path.resolve(`./src/pages/tag.tsx`),
      context: {
        tag,
      },
    });
  });

};
