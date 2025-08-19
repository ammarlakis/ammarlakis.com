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

// Generate JSON Feed (https://jsonfeed.org/version/1) after build
exports.onPostBuild = async ({ graphql, reporter }: { graphql: any, reporter: any }) => {
  const fs = require('fs');
  const path = require('path');

  const result = await graphql(`
    {
      site {
        siteMetadata {
          title
          description
          siteUrl
        }
      }
      allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
        nodes {
          excerpt
          html
          fields { slug }
          frontmatter { title date tags }
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild('Error while generating JSON feed', result.errors);
    return;
  }

  const site = result.data.site.siteMetadata;
  const items = result.data.allMarkdownRemark.nodes.map((node: any) => ({
    id: site.siteUrl + node.fields.slug,
    url: site.siteUrl + node.fields.slug,
    title: node.frontmatter.title,
    content_html: node.html,
    summary: node.excerpt,
    date_published: node.frontmatter.date,
    tags: node.frontmatter.tags || undefined,
  }));

  const feed = {
    version: 'https://jsonfeed.org/version/1',
    title: site.title,
    description: site.description,
    home_page_url: site.siteUrl,
    feed_url: site.siteUrl.replace(/\/$/, '') + '/feed.json',
    items,
  };

  const outPath = path.resolve('public', 'feed.json');
  fs.writeFileSync(outPath, JSON.stringify(feed, null, 2), 'utf8');
  reporter.info(`JSON feed generated at /feed.json (${items.length} items)`);
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
