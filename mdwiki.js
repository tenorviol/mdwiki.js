var express = require('express'),
    markdown = require('./lib/markdown'),
    dynamic = require('./lib/dynamic');

var docroot = '/Users/chris/Dropbox';

express.createServer()
  .register('.md', markdown)
  .register('.markdown', markdown)
  
  .set('views', __dirname + '/views')
  
  .use(express['static'](__dirname + '/static'))
  .use(express.favicon())
  .use(dynamic.express(docroot))
  .listen(3000);
