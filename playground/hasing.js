import { SHA256 } from "crypto-js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const password = "123abc!";
//salt will encrypt the password with a different code every single time
//(number of rounds to generate the salt)
bcrypt.genSalt(10, (err, salt) => {
  //the password to be hash / the salt we have just create /callback function
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  });
});

const hashedPassword =
  "$2a$10$bnD5oMwThWlYgjHaxVeTWuUOMVV/slifr3glj3cpVXlQZl1/cY4pi";
//the password, hash value, callback /the res will be true or false

bcrypt.compare(password, hashedPassword, (err, res) => {
  console.log(res);
});
