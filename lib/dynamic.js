var path = require('path'),
    fs = require('fs'),
    url = require('url'),
    qs = require('querystring');

exports.express = function(root, options) {
  options = options || {};
  
  // root required
  if (!root) {
    throw new Error('dynamic.express() root path required');
  }
  
  return function(req, res, next) {
    var parts = url.parse(req.url);
    var uri = path.normalize(parts.pathname);
    var file = root + qs.unescape(uri);
    
    var crumbs = uri.split('/');
    crumbs[0] = {
      name: 'HOME',
      url: '/'
    };
    for (var i = 1; i < crumbs.length; i++) {
      crumbs[i] = {
        name: qs.unescape(crumbs[i]),
        url: crumbs[i-1].url + crumbs[i] + '/'
      }
    }
    var locals = {
      crumbs: crumbs
    };
    
    fs.stat(file, function(err, stats) {
      if (err) {
        next();
      } else if (stats.isDirectory()) {
        renderDirectory(file, res, locals);
      } else if (/\.(md|markdown)$/.test(file)) {
        renderFile(file, res, locals);
      } else {
        next();
      }
    });
  };
};

function renderFile(file, res, locals) {
  res.render(file, {
    layout : 'mdlayout.jade',
    locals : locals
  });
}

function renderDirectory(dir, res, locals) {
  var dir = fs.readdir(dir, function(err, files) {
    for (var i in files) {
      if (!(/\.(md|markdown)$/.test(files[i]))) {
        files[i] += '/';
      }
    }
    locals.dir = files;
    res.render('dir.jade', {
      layout : 'layout.jade',
      locals: locals
    });
  });
}
