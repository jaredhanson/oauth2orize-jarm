var crypto = require('crypto');
var XmlEntities = require('html-entities').XmlEntities;
var entities = new XmlEntities();
var SignJWT = require('jose/jwt/sign').SignJWT;
var merge = require('utils-merge');


var input = '<input type="hidden" name="{NAME}" value="{VALUE}"/>';
var html = '<html>' +
  '<head><title>Submit This Form</title></head>' +
  '<body onload="javascript:document.forms[0].submit()">' +
    '<form method="post" action="{ACTION}">' +
      '{INPUTS}' +
    '</form>' +
  '</body>' +
'</html>';


module.exports = function() {
  
  function respond(txn, res, params) {
    var payload = {};
    merge(payload, params);
    
    var jwt = new SignJWT(params);
    jwt.setProtectedHeader({ alg: 'HS256' })
      .setIssuer('http://localhost:3001/')
      .setAudience(txn.client.id)
      .setExpirationTime('10m')
      .sign(crypto.createSecretKey(Buffer.from('foofyasdfaeecasdfdafdedadfdfaedafaeasdfaedbasde')))
      .then(function(token) {
        var inputs = [];
        inputs.push(input.replace('{NAME}', 'response').replace('{VALUE}', entities.encode(token)));

        res.setHeader('Content-Type', 'text/html;charset=UTF-8');
        res.setHeader('Cache-Control', 'no-cache, no-store');
        res.setHeader('Pragma', 'no-cache');

        return res.end(html.replace('{ACTION}', entities.encode(txn.redirectURI)).replace('{INPUTS}', inputs.join('')));
      })
  }
  
  return respond;

};
