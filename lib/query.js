var crypto = require('crypto');
var merge = require('utils-merge');
var SignJWT = require('jose/jwt/sign').SignJWT;
var url = require('url');


// TODO: If response type is token or id_token, error if JWT is not encrypted

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
        var parsed = url.parse(txn.redirectURI, true);
        delete parsed.search;
        parsed.query.response = token;

        var location = url.format(parsed);
        console.log('JARM QUERY: ' + location);
        return res.redirect(location);
      });
  }
  
  return respond;

};
