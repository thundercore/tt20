const util = require('util');

const format = (o) => { /* : string */
    // https://nodejs.org/api/util.html#util_util_inspect_object_options
   return util.inspect(o, {showHidden: false, depth: null, colors: true})
}

module.exports = { format: format }
