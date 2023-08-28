const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../../db/models");

module.exports = async function signUp(req, res, next) {
  try {
    const { firstName, lastName, email, password } = req.body;
    const data = {
      firstName,
      lastName,
      email,
      password: await bcrypt.hash(password, 10)
    };
    const user = await User.create(data);
    if (user) {
      let token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
        algorithm: "HS256",
        expiresIn: 1 * 24 * 60 * 60 * 1000
      });
      res.status(200).json({
        accessToken: token,
      });
    }
  } catch (err) {
    console.log(err);
  }
}