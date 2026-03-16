require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8000;

/* ---------------- MongoDB Connection ---------------- */

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("MongoDB Connected"))
.catch((err)=>console.log(err));

/* ---------------- Book Schema ---------------- */

const bookSchema = new mongoose.Schema({

title:{
type:String,
required:true
},

author:{
type:String,
required:true
},

isbn:{
type:String,
required:true,
unique:true
},

genre:{
type:String,
required:true
},

publisher:{
type:String,
required:true
},

publicationYear:{
type:Number
},

totalCopies:{
type:Number,
required:true,
min:1
},

availableCopies:{
type:Number
},

shelfLocation:{
type:String
},

bookType:{
type:String,
enum:["Reference","Circulating"]
},

status:{
type:String,
default:"Available"
}

},{timestamps:true});

const Book = mongoose.model("Book",bookSchema);

/* ---------------- Add Book ---------------- */

app.post("/books", async(req,res)=>{

try{

const book = new Book(req.body);

await book.save();

res.status(201).json({
message:"Book created",
data:book
});

}catch(error){

res.status(400).json({error:error.message});

}

});

/* ---------------- Get All Books ---------------- */

app.get("/books", async(req,res)=>{

try{

const books = await Book.find();

res.status(200).json(books);

}catch(error){

res.status(500).json({error:error.message});

}

});

/* ---------------- Get Book By ID ---------------- */

app.get("/books/:id", async(req,res)=>{

try{

const book = await Book.findById(req.params.id);

if(!book){
return res.status(404).json({message:"Book not found"});
}

res.status(200).json(book);

}catch(error){

res.status(500).json({error:error.message});

}

});

/* ---------------- Update Book ---------------- */

app.put("/books/:id", async(req,res)=>{

try{

const book = await Book.findByIdAndUpdate(
req.params.id,
req.body,
{new:true}
);

if(!book){
return res.status(404).json({message:"Book not found"});
}

res.status(200).json({
message:"Book updated",
data:book
});

}catch(error){

res.status(400).json({error:error.message});

}

});

/* ---------------- Delete Book ---------------- */

app.delete("/books/:id", async(req,res)=>{

try{

const book = await Book.findByIdAndDelete(req.params.id);

if(!book){
return res.status(404).json({message:"Book not found"});
}

res.status(200).json({
message:"Book deleted"
});

}catch(error){

res.status(500).json({error:error.message});

}

});

/* ---------------- Search Book ---------------- */

app.get("/search", async(req,res)=>{

try{

const {title,author} = req.query;

const books = await Book.find({

$or:[
{title:new RegExp(title,"i")},
{author:new RegExp(author,"i")}
]

});

res.status(200).json(books);

}catch(error){

res.status(500).json({error:error.message});

}

});

/* ---------------- Error Middleware ---------------- */

app.use((err,req,res,next)=>{

res.status(500).json({
message:"Server Error",
error:err.message
});

});

/* ---------------- Server ---------------- */

app.listen(PORT,()=>{
console.log(`Server running on port ${PORT}`);
});


app.get("/", (req,res)=>{
res.send("API working");
});

app.get("/", (req, res) => {
  res.send("API is working");
});