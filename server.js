const express = require("express")
const mongoose = require("mongoose")
const contactModel = require("./models/contact")

let app = express()
app.use(express.json())
app.use("/", express.static("public"))

let port = process.env.PORT || 3000

const mongo_url = process.env.MONGODB_URL
const mongo_user = process.env.mongodb_user
const mongo_password = process.env.mongodb_password

const url = 
"mongodb+srv://"+ mongo_user + ":" + mongo_password +
"@"+ mongo_url + "/contactdatabase?retryWrites=true&w=majority"


mongoose.connect(url).then (
    ()=> console.log("Connected to MongoDB"),
    (error) => 
    console.log("Failed to connect MongoDB. Reason", error)
)

app.get("/api/contact", function(req,res){
    contactModel.find().then
    (function(contacts){
        return res.status(200).json(contacts)
    })
    .catch(function(err) {
        console.log("Database returned an error", err)
        return res.status(500).json({"Message":"Internal server error"})
    })
})
 
app.post("/api/contact",function(req,res){
    if(!req.body) {
        return res.status(400).json({"Message":"Bad request"})
    }
    if(!req.body.firstname) {
        return res.status(400).json({"Message":"Bad request"})
    }
let contact = new contactModel ({
    "firstname":req.body.firstname,
    "lastname":req.body.lastname,
    "email":req.body.email,
    "phone":req.body.phone
})
contact.save()
.then(function(contact){
    return res.status(201).json(contact)
})
.catch(function(error){
    console.log("Database responded error status", error)
    return res.status(500).json({"Message":"Internal server error"})
})

})

app.delete("/api/contact/:id", function(req,res){
    contactModel.deleteOne({"_id":req.params.id
})
.then(function(){
    return res.status(200).json({"Message":"Success"})
})
.catch(function(error){
    console.log("Database responend wiht error", error)
    return res.status(500).json({"Message":"Internal server error"})
})
})

app.put("/api/contact/:id", function(req, res){
    if(!req.body){
        return res.status(400).json({"Message":"Bad req"})
    }
    if(!req.body.firstname){
        return res.status(500).json({"Message":"Bad req"})
    }
    let contact = {
        "firstname":req.body.firstname,
        "lastname":req.body.lastname,
        "email":req.body.email,
        "phone":req.body.phone
    }
    contactModel.replaceOne({"_id":req.params.id}, contact)
    .then(function(){
        return res.status(200).json({"Message":"Success"})
    })
    .catch(function(error){
        console.log("Database returned error", error)
        return res.status(500).json({"Message":"Internal server err"})
    })
})



app.listen(3000)
console.log("Running in port", port)