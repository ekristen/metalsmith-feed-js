var RSS = require('rss')
var extend = require('extend')
var url = require('url')

module.exports = function(options) {
  var collectionName, destination, limit
  
  options = options || {}
  
  limit = options.limit || 20
  destination = options.destination || 'rss.xml'
  collectionName = options.collection
  tagName = options.tag
  tagHandle = options.handle || 'tags'

  if (!collectionName && !tagName) {
    throw new Error('collection or tag option is required');
  }

  return function(files, metalsmith, done) {
    var collection, tag, feed, feedOptions, file, itemData, metadata, siteUrl, _i, _len, _ref

    metadata = metalsmith.metadata()
    if (!metadata.collections && !metadata.tags) {
      return done(new Error('no collections or tags configured - see metalsmith-collections or metalsmith-tags'))
    }

    if (collectionName) {
      collection = metadata.collections[collectionName]
    }

    if (tagName) {
      collection = metadata[tagHandle][tagName]
    }

    feedOptions = extend({}, metadata.site, options, {
      site_url: (_ref = metadata.site) != null ? _ref.url : void 0,
      generator: 'metalsmith-feed'
    });

    siteUrl = feedOptions.site_url
    if (!siteUrl) {
      return done(new Error('either site_url or metadata.site.url must be configured'));
    }

    if (feedOptions.feed_url == null) {
      feedOptions.feed_url = url.resolve(siteUrl, destination)
    }

    feed = new RSS(feedOptions)
    if (limit) {
      collection = collection.slice(0, limit)
    }

    for (_i = 0, _len = collection.length; _i < _len; _i++) {
      file = collection[_i]
      itemData = extend({}, file, {
        description: file.less || file.excerpt || file.contents
      })
      if (!itemData.url && itemData.path) {
        itemData.url = url.resolve(siteUrl, file.path)
      }
      feed.item(itemData)
    }

    files[destination] = {
      contents: new Buffer(feed.xml(), 'utf8')
    }

    return done()
  }
}
