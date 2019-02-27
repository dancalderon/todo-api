import { SHA256 } from 'crypto-js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const password = '123abc!';
// bcrypt.genSalt(10, (err, salt) => {
//   bcrypt.hash(password, salt, (err, hash) => {
//     console.log(hash);
//   });
// });

const hashedPassword =
  '$2a$10$bnD5oMwThWlYgjHaxVeTWuUOMVV/slifr3glj3cpVXlQZl1/cY4pi';

async function go() {
  const res = await bcrypt.compare(password, hashedPassword);
  console.log(res);
}
go();
