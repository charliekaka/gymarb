const MongoClient = require("mongodb").MongoClient;
const bcrypt = require("bcrypt");

const MongoURL = "mongodb://localhost:27017";

export default async function(req, res) {
  return new Promise((resolve,reject)=>{
    if(req.method !== "POST") return reject("invalid method");
  
    const d = new Date();
    // adds 0 in front of one digit dates
    const month = d.getMonth()+1 <= 9 ? `0${d.getMonth()+1}` : d.getMonth()+1;
    const date = d.getDate() <= 9 ? `0${d.getDate()}` : d.getDate();
  
    // stores date as YYYY-MM-DD
    const timeOfRegister = `${d.getFullYear()}-${month}-${date}`;
  
    // userdata db content
    const userData = {
      date: timeOfRegister,
      email: req.body.email,
      username: req.body.username,
      // might do async hashing later
      password: bcrypt.hashSync(req.body.password, 10)
    };
  
    // connect to db
    MongoClient.connect(MongoURL, (err,db)=>{
      if(err) throw err;
      // root db
      const currentDB = db.db("gymarb");
      // specifies user collection
      const dbCollection = currentDB.collection("users");
  
      // search db if username is taken
      dbCollection.countDocuments({username: userData.username}, { limit: 1 }, (err,result)=>{
        if(err) throw err;
        if(result){
          res.json({"error":"Username already taken"});
          db.close();
        }else{
          // register user to db
          dbCollection.insertOne(userData, (err,result)=>{
            if(err) throw err;
            console.log(result);
            res.json(result);
            resolve()
            db.close();
          })
        }
      });
    })
  })
}