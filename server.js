const express = require('express');
const mongodb=require('mongodb');
const bodyParser = require("body-parser");
var app=express();
ObjectId = require('mongodb').ObjectID;
var mongoClient=mongodb.MongoClient;
app.use(bodyParser.urlencoded({extended:true}));
var url="mongodb://mongo:27017/";
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.get("/",function(req,res){
        res.send("hello1245");
        console.log("requested");
});
app.post("/signup",function(req,res){
	console.log(req);
	mongoClient.connect(url,function(err,db){
	if(err)
	{
	 res.send("-1");
	 console.log("db not connected");
	}
	else
	{
		var dbo=db.db("mydb");
		var query = { email: req.query.email };
		dbo.collection("users").findOne(query,function(err,resu){
		if(err)
		{
	          console.log(err);
		}
		if(resu==null)
		{
			var user={
               		 
               		 name:req.query.name,
            	         email:req.query.email,
              	         phonenumber:req.query.phonenumber,
              	         address:req.query.address,
               		 }
               		
               	 dbo.collection("users").insertOne(user,function(err,res){
                   if(err){
                    res.send("-1");
                  }
                  else
                  {
                        console.log("user added");
                  }
	            });
		}
		else
		{
			console.log("Email Already Register");
		}			  
		});		

       	}	
    });
});

app.get("/auth",function(req,res){
	
	mongoClient.connect(url,function(err,db){
        	if(err)
        	{
                  console.log("Unable to connect",err);
        	}
		else
		{
		  console.log("Connection established");
		  var dbo=db.db("mydb");
		  dbo.collection("users")
		  
		}
	});
});
app.get("/billing_record",function(req,res){
});

app.listen(3000,function(){
    console.log("Server started");
});

