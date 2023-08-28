const { User }= require("../../db/models");

module.exports = async function checkDuplicateEmail(req, res, next) {
  const user = await User.findOne({
    where: {
      email: req.body.email
    }
  })
  if (user) {
    res.status(400).send({
      message: "Email ya está en uso!"
    });
    return;
  }
  next();
}