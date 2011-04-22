var md = require('discount');  // C markdown parser

exports.compile = function(str, options) {
  var html = md.parse(str);
  return function(locals) {
    return html;  // no locals replacement
  };
};
