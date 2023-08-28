const bcrypt = require("bcrypt");
const { User } = require("../../db/models");
const jwt = require("jsonwebtoken");

module.exports = async function login(req, res, next) {
  const {email, password} = req.body;
  try {
    const user = await User.findOne({ where:{email: email}});
    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado." });
    }
    const passwordIsValid = bcrypt.compare(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Contraseña inválida!"
      });
    }
    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
      algorithm: "HS256",
      expiresIn: 1 * 24 * 60 * 60 * 1000
    });
    res.status(200).json({
      accessToken: token,
    })
  } catch (err) {
    console.log(err);
  }
}