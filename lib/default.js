var query = require('./query');
var fragment = require('./fragment');


module.exports = function() {
  var qrm = query();
  var frm = fragment();
  
  function respond(txn, res, params) {
    console.log('default response jwt');
    console.log(txn);
    
    if (txn.req.type == 'code') {
      qrm(txn, res, params);
    } else {
      frm(txn, res, params);
    }    
  }
  
  return respond;
};
