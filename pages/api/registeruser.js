const MongoClient = require("mongodb").MongoClient;
const bcrypt = require("bcryptjs");
const MongoURL = "mongodb://localhost:27017";

export default function(req, res) {
  return new Promise((resolve, reject)=>{
    const d = new Date();
    // date of register
    const timeOfRegister = `${d.getFullYear()}-${d.getMonth()-1}-${d.getDate()}`;
    // userdata db content
    const userData = {
      date: timeOfRegister,
      email: req.body.email,
      username: req.body.username,
      // might do async hashing later
      password: bcrypt.hashSync(req.body.password, 10)
    }

  })
}