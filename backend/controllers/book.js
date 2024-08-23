const book = require("../models/book");

// fonction pour creer un nouveau book
 exports.createBook = (req,res,next)=>{
    delete req.body._id;
    const book = new Book({
        ...req.body
    });
    
    // sauvegarder le livre dans la BD 
    book.save()
    .then(()=> res.status(201).json({message:"Livre enregistré"}))
    .catch(error => res.status(400).json({error}))
 }

 // fonction pour modifier un book 

 exports.modifyBook = (req,res,next)=>{

 }

 //fonction pour suppression de livre

 exports.deleteBook =(req,res,next)=>{

 }

 exports.getOneBook = (req,res,next)=>{

 }

 exports.getAllBooks = (req,res,next)=>{
    
 }