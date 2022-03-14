const MongoClient = require("mongodb").MongoClient;

const MongoURL = "mongodb://localhost:27017";

export default async function handler(req,res){
    return new Promise((resolve, reject)=>{
        // check for invalid method
        if(req.method !== "POST") reject("invalid method / endpoint");
        // user object
        const listing = req.body

        const d = new Date();
        // adds 0 in front of one digit dates
        const month = d.getMonth()+1 <= 9 ? `0${d.getMonth()+1}` : d.getMonth()+1;
        const date = d.getDate() <= 9 ? `0${d.getDate()}` : d.getDate();
        // stores date as YYYY-MM-DD
        const time = `${d.getFullYear()}-${month}-${date}`;

        // add date to object
        listing.date = {
            raw: Date.now(),
            plain: time
        }

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
            const root = db.db("gymarb");
            // specifies user collection
            const listings = root.collection("listings");

            listings.countDocuments().then(docs=>{
                // add id to listing
                listing.id = docs+1

                // insert listing
                listings.insertOne(listing,(err, result)=>{
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
    })
}
