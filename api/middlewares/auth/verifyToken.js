const jwt = require("jsonwebtoken");
const { User } = require("../../db/models/index.js");

module.exports = function verifyToken(req, res, next) {
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({
      message: "No se proporcionó ningún token!"
    });
  }
  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "No autorizado!"
      });
    }
    req.userId = decoded.id;
    next();
  })
}