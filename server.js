const express = require('express');
const mongodb = require('mongodb');
const bodyParser = require("body-parser");
var app = express();

ObjectId = require('mongodb').ObjectID;
var bcrypt = require('bcrypt');
const saltRounds = 10;
var cors = require("cors");
app.use(cors());
var mongoClient = mongodb.MongoClient;
var autoIncrement = require("mongodb-autoincrement");
app.use(bodyParser.urlencoded({ extended: true }));
var url = "mongodb://mongo:27017/";
app.use(express.static("resources"));
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});
app.get("/", function (req, res) {
	res.send("hello1245");
	console.log("requested");
});
/**********************************sign up******************/
app.post("/signup", function (req, res) {
	
	console.log(req.body.params);
	console.log(req.query);
	mongoClient.connect(url, function (err, db) {
		if (err) {
			console.log("db not connected");
			var failure={
				status:"failure",
				message:err,
			}
			res.send(failure);	
		}
		else {
			var dbo = db.db("mydb");
			var query = { email: req.query.email };
			console.log(req);
			dbo.collection("users").findOne(query, function (err, resu) {
				if (err) {
					console.log(err);
					var failure={
						status:"failure",
						message:err,
					}
					res.send(failure);
				}
				if (resu == null) {
					
					var hash = bcrypt.hashSync(req.query.password, saltRounds);
					var user = {
						name: req.query.name,
						email: req.query.email,
						phonenumber: req.query.phonenumber,
						address: req.query.address,
						password: hash,
					}

					dbo.collection("users").insertOne(user, function (err, res) {
						if (err) {
							console.log(err);
							var failure={
								status:"failure",
								message:err,
							}
							res.send(failure);
						}
						else {
							console.log("user added");
							var success={
								status:"success",

							}
						}
					});
				}
				else {
					var failure={
						status:"failure",
						message:"Email Already Used",
					}
					res.send(failure);
				}
			});

		}
	});
});
/*Authentication*/
app.post("/auth", function (req, res) {

	mongoClient.connect(url, function (err, db) {
		if (err) {
			console.log("Unable to connect", err);
			return 7624;
		}
		else {
			console.log("Connection established");
			var dbo = db.db("mydb");
			var query = { username: req.query.email };
			dbo.collection("users").findOne(query, function (err, resu) {
				if (err)
					return 7655;
				else {
					if (resu == null) {
						return 7656;
					}
					else {
						var hash = resu.password;
						var ans = bcrypt.compareSync(myPlaintextPassword, hash);
						if (ans)
							return 7653;
						else
							7655;
					}
				}
			});
		}
	});
});
app.post("/admin/price_table", function (req, res) {
	mongoClient.connect(url, function (err, db) {
		if (err) {
			console.log(err);
			return 7624;
		}
		else {
			var dbo = db.db("mydb");
			var object = {
				itemcode: req.query.itemcode,
				itemname: req.query.itemname,
				cost: req.query.cost,
				timing_start: req.query.start,
				timing_end: req.query.end,
				channel_id: req.query.id,
				channel_name: req.query.channel_name,
				icon: req.query.image_path,

			}
			console.log("created object at price_table");
			dbo.collection("price_table").insertOne(object, function (err, resu) {
				if (err)
					return 7655;

				console.log(resu);
				return 7653;
			});
		}
	});
});
app.get("/getChannels", function (req, res) {
	mongoClient.connect(url, function (err, db) {
		if (err)
			return 7624;
		else {
			var dbo = db.db("mydb");
			var collection=dbo.collection("price_table");
			collection.aggregate([{"$group" : {_id:{channel_name:"$channel_name"}, price_table: {$push : "$$ROOT"}}} ])
				.toArray(function (err, result) {
				if (err) {
					// console.log(err);
					console.log("err");
				}

				else {
					res.send(result);
					
				}
			});
		}
	});
});
app.post("/billing_record", function (req, res) {
	mongoClient.connect(url, function (err, db) {
		if (err) {
			console.log("Unable to connect", err);
		}
		else {
			console.log("Connection established");
			var dbo = db.db("mydb");
			autoIncrement.getNextSequence(dbo, "billing_record", function (err, autoIndex) {
				if (err)
					console.log("fail to add bill");
				else {
					var collection = dbo.collection("billing_record");
					collection.insert({
						payid: autoIndex,
						amount: req.query.amount,
						paydate: new Date(),
						client_id: req.query.clientId,
						itemcode: req.query.itemcode,
					});
					console.log("Added");
				}
			});

		}
	});
});
app.listen(3000, function () {
	console.log("Server started");
});
