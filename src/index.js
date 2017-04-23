const fs = require('fs');
const marked = require('marked');


class ExpressNotebook {

  /**
   * @param {Object} options
   *  @param {Object} [app] - An Express app object.
   *  @param {String} postsDir - A directory relative to your project root directory that contains
   *  your markdown post files and a data.json file.
   *  @param {String} [urlPath] - The URL path where your posts will be available. Setting this to
   *  '/posts' will make a post with slug 'foo' available at '/posts/foo'.
   *  @param {String} [template] - The template with which your post will be rendered. Variables
   *  `post` and `metadata` will be rendered as locals to this template. The `post` local variable
   *  should be rendered unescaped.
   */
  constructor({ app, postsDir, urlPath, template }) {
    this._app = app;
    this._postsDir = postsDir;
    this._urlPath = urlPath;
    this._template = template;

    this._loadData();
  }

  setPostRoutes() {
    this._loadPosts();

    this._setMiddleware();
  }

  /**
   * Reads data.json
   */
  _loadData() {
    const dataStr = fs.readFileSync(`${this._postsDir}/data.json`, 'utf8');
    this._data = JSON.parse(dataStr);
  }

  /**
   * Reads markdown posts files and converts them to HTML. Done once at startup so that we can cache
   * the posts in memory and minimize time spent reading from disk.
   */
  _loadPosts() {
    this._loadedPosts = {};

    this._data.posts.forEach(({ filename, slug }) => {
      const markdown = fs.readFileSync(`${this._postsDir}/${filename}`, 'utf8');

      this._loadedPosts[slug] = marked(markdown);
    });
  }

  /**
   * Sets GET handlers for each of the posts that renders the configured template with the post and
   * its metadata.
   */
  _setMiddleware() {
    this._data.posts.forEach(({ slug, metadata }) => {

      // Register the route for this post.
      this._app.get(`${this._urlPath}/${slug}`, (req, res) => {
        res.render(this._template, {
          metadata,
          post: this._loadedPosts[slug]
        });
      });
    });
  }

  /**
   * Returns the array of posts read in from `data.json`. Useful for retrieving data to be used to
   * render an index of posts, for example.
   */
  getPostData() {
    return this._data.posts;
  }
}

module.exports = ExpressNotebook;
