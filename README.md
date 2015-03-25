metalsmith-feed-js
==================

To each there own and thank you for `hurrymaplelad` for the original metalsmith-feed.

Why the fork? CoffeeScript Sucks (tm)

This is essentially a fork of https://github.com/hurrymaplelad/metalsmith-feed with a few minor improvements to support tags as well as collections.

---

A [metalsmith](https://github.com/segmentio/metalsmith) plugin to generate an RSS feed for a collection.

Requires [metalsmith-collections](https://github.com/segmentio/metalsmith-collections) OR [metalsmith-tags](https://github.com/totocaster/metalsmith-tags)

Plays nicely with [permalinks](https://github.com/RobinThrift/metalsmith-paginate), [more](https://github.com/kfranqueiro/metalsmith-more), and [excerpts](https://github.com/segmentio/metalsmith-excerpts).

## Usage

### Collections
```javascript
var metalsmith = require('metalsmith')
var collections = require('metalsmith-collections')
var feed = require('metalsmith-feed-js')

metalsmith('example')
  .metadata({
    site: {
      title: 'Example',
      url: 'http://example.com',
      author: 'Philodemus'
    }
  })
  .use(collections({
    posts: '*.html'
  }))
  .use(feed({
    collection: 'posts'
  }))
```

### Tags
```javascript
var metalsmith = require('metalsmith')
var tags = require('metalsmith-tags')
var feed = require('metalsmith-feed-js')

metalsmith('example')
  .metadata({
    site: {
      title: 'Example',
      url: 'http://example.com',
      author: 'Philodemus'
    }
  })
  .use(tags({
    /* tag options */
  }))
  .use(feed({
    tag: 'research'
  }))
```

## Options

- `collection` **string** *Required*. Not required if *tag* is used The name of the configured metalsmith-collection to feed.

- `tag` **string** *Required*. Not required if *collection* is used. The name of the configured metalsmith-tags to feed

- `limit` **Number** *Optional*. Maximum number of documents to show in the feed. Defaults to `20`. Set to `false` to include all documents.

- `destination` **string** *Optional*. File path to write the rendered XML feed. Defaults to `'rss.xml'`.

Remaining options are passed to the [rss](https://github.com/dylang/node-rss) module as `feedOptions`, along with `metadata.site`.

If files have `path` metadata (perhaps from [permalinks](https://github.com/RobinThrift/metalsmith-paginate)) but not `url` metadata, we'll prefix `path` with `site_url` to generate links. Feed item descriptions default to `file.less` from metalsmith-more, `file.excerpt` from metalsmith-excerpt, and finally the full `file.contents`.
