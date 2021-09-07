exports.register = (req, res, nex) => {
  res.send("Register route");
};

exports.login = (req, res, next) => {
  res.send("Login");
};
