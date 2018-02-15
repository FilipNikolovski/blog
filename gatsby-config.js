module.exports = {
  siteMetadata: {
    author: 'Filip Nikolovski',
    title: 'Catchy blog name about programming',
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
  ],
};
