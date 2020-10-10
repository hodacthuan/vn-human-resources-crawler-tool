const { Schema, model } = require('mongoose');

const TheSchema = new Schema({
	myworkCandidate: {
		source: {
			type: Number,
			default: null,
		},
		createdDate: {
			type: Number,
			default: null,
		},
	},
});

const Model = model('Crontab', TheSchema);

module.exports = Model;
