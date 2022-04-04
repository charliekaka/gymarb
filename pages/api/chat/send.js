const MongoClient = require("mongodb").MongoClient;

const MongoURL = "mongodb://localhost:27017";

export default async function handler(req,res){
    const {sender, recipient, message} = req.body

    return new Promise((resolve, reject)=>{
        MongoClient.connect(MongoURL, (err,db)=>{
            if(err){
                res.status(500).json({err:"db connection error"})
                return reject("db connection error")
            }

            // append new message
            db.db("gymarb").collection("chat").updateOne(
                {$or:[
                    {users:[sender, recipient]},
                    {users:[recipient, sender]}
                ]},
                {$push:{logs:{
                    time: Date.now(),
                    sender: sender,
                    content: message
                }}}
                ,(err,result)=>{
                    if(err){
                        res.status(500).json({err:"db update error"})
                        return reject("db update error")
                    }
                    res.status(200).json({msg:"success"})
                    return resolve(true)
                }
            )
        })
    })
}