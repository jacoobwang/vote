var mongoose = require( 'mongoose' );
var Schema = mongoose.Schema;

var Project = mongoose.model( 'project', new Schema({
	
	title: {
		type : String,
		default: ''	
	},

	img: {
		type : String,
		default: ''
	},

	num: {
		type : Number,
		default : 1	
	},

	mark: {
		type : Number,
		default : null 	
	},

	createTime: {
		type : String,
		default : ''		
	},

	master: {
		type : String,
		default : ''		
	},

	author: {
		type : String,
		default : ''
	},

	color: {
		type : String,
		default : ''	
	}
}));

module.exports = Project;
