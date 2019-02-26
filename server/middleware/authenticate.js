//we need to import User in order to use his methods
import { User } from "../models/user";

const authenticate = (req, res, next) => {
  const token = req.header("x-auth");
  User.findByToken(token)
    .then(user => {
      if (!user) Promise.reject();
      req.user = user;
      req.token = token;
      next();
    })
    .catch(err => res.status(401).send());
};

export { authenticate };
