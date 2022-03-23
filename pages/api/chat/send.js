const MongoClient = require("mongodb").MongoClient;

const MongoURL = "mongodb://localhost:27017";

export default async function handler(req,res){
    const {author, recipient, content} = req.body;

    // initial validations
    new Promise((resolve, reject)=>{
        // check http method
        if(req.method !== "POST"){
            res.status(405)
            reject({err:"invalid method"})
        }

        // check for invalid inpits
        for(let el of Object.values(req.body)){
            if(!el){
                res.status(400)
                reject({err:"invalid body"})
            }
        }

        // connect db
        MongoClient.connect(MongoURL, (err,db)=>{
            if(err){
                res.status(500)
                reject({err: "db connection error"})
            }

            // search for recipient
            db.db("gymarb").collection("users").countDocuments({username: recipient}, { limit:1 }, (err,found)=>{
                if(err){
                    res.status(560)
                    db.close()
                    reject({err: "db query error"})
                }
                if(found){
                    db.close()
                    resolve(true)
                }else{                    
                    res.status(404)
                    db.close()
                    reject({err: "recipient not found"})
                }
            })
        })
    })
    .then(r=>{
        // handle chat
        return new Promise((resolve, reject)=>{
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

            MongoClient.connect(MongoURL, (err,db)=>{
                if(err){
                    res.status(500)
                    return reject({err: "db connection error"})
                }

                // check if chat instance already exists
                db.db("gymarb").collection("chat").countDocuments({users:[author, recipient]}, { limit:1 }, (err,chat)=>{
                    if(err){
                        res.status(500)
                        return reject({err: "db query error"})
                    }
    
                    if(chat){
                        res.status(400)
                        return reject({err: "Chat duplicate"})
                    }else{
                        db.db("gymarb").collection("chat").insertOne(data, (err, result)=>{
                            if(err){
                                res.status(500)
                                return reject({err:"db query error"})
                            }
                            return resolve({msg:"success"})
                        })
                    }
                })
            })
        })
    })
    // .catch(err=>{
    //     console.log("meeee");
    //     return Promise.reject(err)
    // })
}
