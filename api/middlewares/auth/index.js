const checkDuplicates = require('./checkDuplicates');
const verifyToken = require('./verifyToken');

const authMiddlewares = {
  checkDuplicates,
  verifyToken
}

module.exports = authMiddlewares;