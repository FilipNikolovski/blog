module.exports = {
  siteMetadata: {
    author: 'Filip Nikolovski',
    title: 'Catchy blog name about programming',
  },
  plugins: [
    'gatsby-plugin-catch-links',
    'gatsby-plugin-react-helmet',
    'gatsby-transformer-remark',
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'src',
        path: `${__dirname}/src`
      }
    }
  ],
};
