import { delBasePath } from "next/dist/shared/lib/router/router";
import { __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED } from "react-dom";

const MongoClient = require("mongodb").MongoClient;

const MongoURL = "mongodb://localhost:27017";

export default async function handler(req,res){
    return new Promise((resolve, reject)=>{
         // check for invalid method
         if(req.method !== "POST"){
             res.status(405)
             reject("invalid method");
         }
     
         // check for invalid body
         for(let el of Object.values(req.body)){
             if(!el){
                 res.status(400)
                 reject("invalid body");
             }
         }

        const {author, recipient, content} = req.body;

        MongoClient.connect(MongoURL, (err,db)=>{
            // on db error
            if(err){
                res.status(400)
                reject("db error");
            }

            // root db
            const root = db.db("gymarb");
            // needed collections
            const users = root.collection("users");
            const chat = root.collection("chat");

            // search for recipient
            users.countDocuments({username: recipient}, { limit:1 }, (err,result)=>{
                // on query fail
                if(err){
                    res.status(500)
                    reject("db error")
                }

                // check if recipient exists
                if(!result){
                    res.status(400)
                    reject("No recipient found");
                }

                // search for existing chat
                chat.countDocuments({users:[author, recipient]}, { limit:1 }, (err,chat)=>{
                    if(err){
                        res.status(500)
                        reject("db error")
                    }

                    // check if chat instance already exists
                    if(chat){
                        res.status(400)
                        reject("Chat duplicate")
                    }
                })



                // chat object
                const data = {
                    time: Date.now(),
                    users: [author, recipient],
                    logs: [
                        {
                            time: Date.now(),
                            sender:author,
                            content: content
                        }
                    ]
                }

                // // inset chat object
                // chat.insertOne(data, (err)=>{
                //     if(err){
                //         res.status(500)
                //         reject("db fail");
                //     }

                //     // message sent success
                //     resolve("success")
                // })
            })
            resolve("end")
        })
    })
    .then(r=>{
        console.log("then",r);
        res.json({msg: r})
    })
    .catch(e=>{
        console.log("catch",e)
        res.json({err: e})
    })
}

ongotpointercaptur2