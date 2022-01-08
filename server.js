const express = require("express");
const next = require("next");

/*

not in use
npm run dev

*/

// check if dev
const dev = process.env.NODE_ENV !== "production";
const app = next({dev});
// next req handler
const handle = app.getRequestHandler();

// init next app
app.prepare()
.then(()=>{
  const server = express();

  // render path
  server.get("*", (req,res)=>{
    return handle(req,res)
  })
  // start server
  server.listen(3000,(err)=>{
    if(err) throw err;
    console.log("server started on http://localhost:3000");
  })
})
.catch((err)=>{
  console.log(err);
  process.exit(1)
})

