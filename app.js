var express = require('express'),
	fs      = require('fs'),
	multer  = require('multer'),
	http    = require('http');
var mongoose = require( 'mongoose' );
var app = express();
var vote= require('./models/VoteModel.js').VoteModel;

app.use(express.static(__dirname + '/vote'));

var uploader = multer({
	storage : multer.diskStorage({
		destination: function(req, file, cb){
			cb(null,'vote/images');			 
		},
		filename: function(req, file, cb){
			var now = new Date();
			cb(null, now.getFullYear() +
				('0' + (now.getMonth()+1)).slice(-2) + 
				('0' + now.getDate()).slice(-2) + 
				('0' + now.getHours()).slice(-2) + 
				('0' + now.getMinutes()).slice(-2) + 
				('0' + now.getSeconds()).slice(-2) + 
				('0' + Math.floor(Math.random()*100)).slice(-2)		
			)			
		}			
	})
});

var webConfig = {
	dbName : 'vote'
};

mongoose.Promise = global.Promise;
mongoose.connect( 'mongodb://localhost/' + webConfig.dbName, {
	server : {
		autotg_reconnect: true,
		poolSize: 10,
		auth : false
	}
},function( err){
	if(err){
		console.log('[mongoose log] Connect Error :' + err);
	}
});

app.get('/',function( req, res) {
    res.send('Hello World');			
});

app.get('/add',function(req,res){
	vote.add( req, res);
});

app.get('/vote',function( req, res) {
	vote.list( req, res) ;
});

app.get('/getOne',function( req, res){
	vote.getOne(req, res);
});

app.get('/mark',function( req, res){
	fs.appendFile('vote.txt', req.query.num+",", function(err){
		if(err) throw err;		
		res.send('success');
	})
});

app.get('/markrs',function( req, res){
	fs.readFile('vote.txt','utf-8',function(err, data){
		var rs = JSON.parse('['+data.substring(0,data.length-1)+']');
		var total=0,fin=0;
		if(rs.length == 3){
			for(var i in rs){total += rs[i];}
			fin = total/3;
		}
		res.send(''+fin);
	});	
});

app.get('/update',function( req,res){
	vote.update(req ,res);	
});

app.post('/upload',function( req, res, next){
	fs.exists('vote/images', function(isExists) {
		//if(!isExists){	fs.mkdirSync('temp');}
		next();
	})
	}, uploader.single('file'),function(req ,res, next){
		res.send(req.file);	
});

app.listen(3001, function(){
    console.log('app is running at port 3001');		
});

