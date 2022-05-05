const MongoClient = require("mongodb").MongoClient;

const MongoURL = "mongodb://localhost:27017";

export async function handleChat(username){
    return new Promise((resolve, reject)=>{
        // connect db
        MongoClient.connect(MongoURL, (err,db)=>{
            if(err) reject("db connection error");

            // get chats of user
            db.db("gymarb").collection("chat").find({
                // get all chats that user is part of
                users:{$in:[username]}
            }).toArray((err, res)=>{
                if(err) reject("db query error");
                resolve(res)
            })
        })
    })
}