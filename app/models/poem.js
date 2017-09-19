var mongoose = require('mongoose');

var poemSchema = mongoose.Schema({
	author : String,
	title: String,
	content: String,
	created: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('Poem', poemSchema);
