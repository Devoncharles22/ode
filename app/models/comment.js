var mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
	author : String,
	content: String,
	created: {type: Date, default: Date.now()},
	poem: String
});

module.exports = mongoose.model('Comment', commentSchema);
