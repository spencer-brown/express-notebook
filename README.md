# express-notebook

A simple, drop-in markdown blogging framework for Express applications.

* Write blog posts in markdown.
* Template-engine-agnostic.
* Simple setup and configuration.
* Drops into existing applications.

## Installation

```sh
$ yarn add express-notebook
```
or
```sh
$ npm install express-notebook --save
```

## Usage

1. Register `express-notebook` with your application.

```js
const Notebook = require('express-notebook');

const notebook = new Notebook({
  // Your Express app object.
  app,

  /**
   * The directory in your project where you'll keep your post markdown files and `data.json`
   * (explained below).
   */
  postsDir: 'src/posts',

  // The URL path prefix where your posts will be accessed (eg example.com/posts/foo-bar).
  urlPath: '/posts',

  /**
   * The template with which your posts will be rendered. Should render a `post` variable that's
   * rendered unescaped since `post` will be an HTML string.
   */
  template: 'post'
});

notebook.setPostRoutes();
```

2. Create a directory for your posts somewhere in your project. In this directory, add a file called `data.json` with your post data like this:

eg, `src/posts/data.json`
```json
{
  "posts": [{

    // The name of the markdown file corresponding to this post. This markdown file should live in the same directory as data.json
    "filename": "foo.md",

    // The URL slug for this post.
    "slug": "my-blog-post",

    // Any metadata want to pass to your post template.
    "metadata": {
      "title": "My blog post title",
      "date": "3/14/2017",
      "location": "San Francisco, California"
    }
  }, {
    ...
  }]
}
```

`express-notebook` also exposes the post data read from `data.json`. This is useful for creating a post index, for example.

```js
...
const posts = notebook.getPostData();

res.render('/posts', {
  posts
});
...
```

## Changelog

* 1.0.1 Bump version for publishing via npm instead of Yarn (see https://github.com/yarnpkg/yarn/issues/1619)
* 1.0.0 Initial release
