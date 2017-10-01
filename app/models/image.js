var mongoose = require('mongoose');

var imageSchema = mongoose.Schema({
	path: {
		type: string,
		required: true,
		trim: true
	},
	originalname: {
		type: string,
		required: true
	}
	});

module.exports = mongoose.model('Files', imageSchema);
router.getImages = (callback, limit) => {
	Image.find(callback).limit(limit);
}
router.getImageById = (id, callback) => {
	Image.findbyId(id, callback);
}
router.addImage = (image, callback) => {
	Image.create(image, callback);
}

