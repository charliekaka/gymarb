const MongoClient = require("mongodb").MongoClient;
const bcrypt = require("bcrypt");

const MongoURL = "mongodb://localhost:27017";

export default function handler(req,res){
    return new Promise((resolve, reject)=>{
        // ensure http method
        if(req.method !== "POST") reject("invalid method / endpoint");
        // get user entered data
        const user = {
            username: req.body.username,
            password: req.body.password
        };
        // open db connection
        MongoClient.connect(MongoURL, (err, db)=>{
            if(err){
                console.log(err);
                res.status(500);
                return;
            }
            // root db
            const currentDB = db.db("gymarb");
            // specifies user collection
            const dbCollection = currentDB.collection("users");
            // check if username is in db
            dbCollection.findOne({username:user.username}, (err,result)=>{
                if(err){
                    console.log(err);
                    res.status(500);
                    return;
                }
                // if no username is found
                if(result === null){
                    res.send(false)
                    resolve();
                    db.close();
                    return;
                }else{
                    // compare entered pwd to hash
                    if(bcrypt.compareSync(user.password, result.password)){
                        console.log("log in");
                        res.send(true);
                        resolve();
                        db.close();
                        return;
                    }else{
                        res.send(false);
                        resolve();
                        db.close();
                        return;
                    }
                }
            })
        })
    })
}
