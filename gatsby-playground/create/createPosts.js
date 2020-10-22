const postTemplate = require.resolve("../src/templates/posts/index.js")

const GET_POSTS = `
    query GET_POSTS($first:Int $after:String) {
      wpcontent {
        posts(
          first: $first
          after: $after
          # This will make sure to only get the parent nodes and no children
          where: {
            parent: null
          }
        ) {
          pageInfo {
            hasNextPage
            endCursor
          }
          nodes {           
            id
            title
            postId
            content
            uri
          }
        }
      }
    }
`


const allPosts = []
let pageNumber = 0;
const itemsPerPage = 10;

/**
 * This is the export which Gatbsy will use to process.
 *
 * @param { actions, graphql }
 * @returns {Promise<void>}
 */
module.exports = async ({ actions, graphql, reporter }, options) => {

  /**
   * This is the method from Gatsby that we're going
   * to use to create posts in our static site.
   */
  const { createPage } = actions

  /**
   * Fetch posts method. This accepts variables to alter
   * the query. The variable `first` controls how many items to
   * request per fetch and the `after` controls where to start in
   * the dataset.
   *
   * @param variables
   * @returns {Promise<*>}
   */
  const fetchPosts = async (variables) =>
    /**
     * Fetch posts using the GET_POSTS query and the variables passed in.
     */
    await graphql(GET_POSTS, variables).then(({ data }) => {
      /**
       * Extract the data from the GraphQL query results
       */
      const {
        wpcontent: {
          posts: {
            nodes,
            pageInfo: { hasNextPage, endCursor },
          },
        },
      } = data

      /**
       * Map over the posts for later creation
       */
      nodes
      && nodes.map((posts) => {
        allPosts.push(posts)
      })

      /**
       * If there's another post, fetch more
       * so we can have all the data we need.
       */
      if (hasNextPage) {
        pageNumber++
        reporter.info(`fetch post ${pageNumber} of posts...`)
        return fetchPosts({ first: itemsPerPage, after: endCursor })
      }

      /**
       * Once we're done, return all the posts
       * so we can create the necessary posts with
       * all the data on hand.
       */
      return allPosts
    })

  /**
   * Kick off our `fetchPosts` method which will get us all
   * the posts we need to create individual posts.
   */
  await fetchPosts({ first: itemsPerPage, after: null }).then((wpPosts) => {

    wpPosts && wpPosts.map((post) => {
      /**
       * Build post path based of theme blogURI setting.
       */
      const path = `${post.uri}`

      createPage({
        path: path,
        component: postTemplate,
        context: {
          post: post,
        },
      })

      reporter.info(`post created:  ${path}`)
    })

    reporter.info(`# -----> POSTS TOTAL: ${wpPosts.length}`)
  })
}