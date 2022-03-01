const MongoClient = require("mongodb").MongoClient;
const MongoURL = "mongodb://localhost:27017";

export function getListings(){
    return new Promise((resolve,reject)=>{
        MongoClient.connect(MongoURL, (err,db)=>{
            if(err) return
            db.db("gymarb").collection("listings").find({}).toArray((err,result)=>{
                if(err) return
                resolve(result)
            })
        })
    })
}