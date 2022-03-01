const MongoClient = require("mongodb").MongoClient;

const MongoURL = "mongodb://localhost:27017";

export default async function handler(req,res){
    return new Promise((resolve, reject)=>{
        // check for invalid method
        if(req.method !== "POST") reject("invalid method / endpoint");
        // user object
        const listing = req.body
        // checking for empty inputs
        for(let key of Object.keys(listing)){
            if(!listing[key]){
                return resolve();
            }
        }
        MongoClient.connect(MongoURL,(err,db)=>{
            if(err){
                console.log(err);
                res.status(500);
                return;
            }
            // root db
            const currentDB = db.db("gymarb");
            // specifies user collection
            const dbCollection = currentDB.collection("listings");
            
            dbCollection.insertOne(listing,(err, result)=>{
                if(err){
                    console.log(err);
                    res.status(500);
                    return;
                }
                res.status(200).json({msg:"success"})
                return resolve()
            })
        })
    })
}
