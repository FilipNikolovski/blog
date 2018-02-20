module.exports = {
  siteMetadata: {
    author: 'Filip Nikolovski',
    title: "Filip's blog",
    siteUrl: `https://filipnikolovski.com`,
    description: "Blog about programming stuff"
  },
  plugins: [
    'gatsby-plugin-catch-links',
    'gatsby-plugin-react-helmet',
    'gatsby-transformer-remark',
    'gatsby-plugin-netlify',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'src',
        path: `${__dirname}/src`
      }
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-114259645-1",
        head: false,
        anonymize: true
      },
    },
    {
      resolve: `gatsby-plugin-feed`
    }
  ],
};
