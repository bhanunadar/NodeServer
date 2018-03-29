var jwt = require('jsonwebtoken');
var secret = "wearegoingtowinSIH";
function verifyToken(req, res, next) {
    var token = req.headers['x-access-token'];
    if (!token)
      return res.status(403).send({ auth: false, message: 'No token provided.' });
  
    jwt.verify(token, secret, function(err, decoded) {
      if (err)
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
  
      // if everything good, save to request for use in other routes
      console.log("verifyToken  "+ JSON.stringify(decoded));
      req.user_id = decoded.id;
      next();
    });
  }
  module.exports = verifyToken;