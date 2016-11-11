var Project = require('../entities/project');

exports.VoteModel = {

	list : function(req,res){
		var num = req.query.num;		   
		Project.find({num:num}, function(err,results){
			res.json(results);
		});
	},

	add : function(req,res){		  
		var ret = new Project({
			title : req.query.title,
			img   : req.query.img,
			num   : req.query.num,
			mark  : req.query.mark,
			master: req.query.master,
			author: req.query.author,
		    color : req.query.color,
			createTime:req.query.date
		});

		
		ret.save(function(err){
			if(err) {
				console.log(err);
				res.json('fail');
				return;
			}else{
				res.json('success');
			}
		});		
	}

}
