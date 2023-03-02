require('dotenv').config();
const jwt = require('jsonwebtoken');

/**
 * Middleware to verify user authentication token
 * @param {Object} req The HTTP request object
 * @param {Object} res The HTTP response object
 * @param {function} next The next middleware function
 * @returns {Object} If the token is valid, adds authenticated userId to req.auth and call next
 */
module.exports = (req, res, next) => {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, process.env.decodedTokenEnv);
      const userId = decodedToken.userId;
      req.auth = {
        userId:  userId
      };
  next();
    } catch(error) {
      res.status(401).json({error});
    }
};
