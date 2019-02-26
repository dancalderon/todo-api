import { SHA256 } from "crypto-js";
import jwt from "jsonwebtoken";
//https://jwt.io
const data = {
  id: 10
};
//jwt.sign will take the object and the secretword to be added
//returns the token
const token = jwt.sign(data, "secretword");
// console.log(token);
//takes the token to verify and the secretword used it to create the token
const decoded = jwt.verify(token, "secretword");
console.log(decoded);
// const message = "I am user number 3";
// //this will return an object, we can pass it to a string
// const hash = SHA256(message).toString();
// console.log(hash);

// const data = {
//   //will be de users.id
//   id: 4
// };
// const token = {
//   data,
//   //we will use the sha256 to incrypt our data, but, we add
//   //a secret string to it, in order to not be recreated if you have the data
//   hash: SHA256(`${JSON.stringify(data)} somesecret`).toString()
// };
// const originalHash = SHA256(`${JSON.stringify(data)} somesecret`).toString();
// //if the token.hash data is not the same as the original, means that
// //it was modificated, and we should not trust in it
// originalHash === token.hash
//   ? console.log("Data was not changed")
//   : console.log("Data was changed, do not trust");
