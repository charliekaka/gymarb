const MongoClient = require("mongodb").MongoClient;
const bcrypt = require("bcrypt");

const MongoURL = "mongodb://localhost:27017";

export default function handler(req,res){
    const auth = new Promise((resolve, reject)=>{
        if(req.method !== "POST") reject("invalid method / endpoint");
        const user = {
            username: req.body.username,
            password: req.body.password
        };
        MongoClient.connect(MongoURL, (err, db)=>{
            if(err) throw err;
            // root db
            const currentDB = db.db("gymarb");
            // specifies user collection
            const dbCollection = currentDB.collection("users");
            dbCollection.findOne({username:user.username}, (err,result)=>{
                if(err) throw err;
                if(result === null){
                    db.close();
                    res.send(reject("wrong username"));
                }else{
                    if(bcrypt.compareSync(user.password, result.password)){
                        db.close();
                        res.send(resolve(true));
                    }else{
                        db.close();
                        res.send(reject("wrong password"));
                    }
                }
            })
        })
    })
    .then(r=>{
        res.json({success: r})
    })
    .catch(err=>{
        res.json({error: err})
    })
}
