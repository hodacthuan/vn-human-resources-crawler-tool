'use strict';

const commons = require('./src/commons/commons');
const fs = require('fs'), path = require('path');
const URL = require('url');
const CONFIG = require('./config/config');
const formidable = require('formidable');
const XLSX = require('xlsx');
const validator = require('validator');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const port = 4000;

require('./src/commons/mongodb');
require('./src/crons');

app.use(bodyParser.json());

app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);

	next();
});

app.get('/list', async (req, res) => {
	let candidateList = await commons.getMarketingCandidateList();
	let allowanceFields = [
		'candidateName',
		'candidateAvatar',
		'candidateBirth',
		'candidateBirthYear',
		'candidateGender',
		'candidateLocation',
		'candidateDistrict',
		'candidateScore',
		'candidateAddress',
	];

	let response = "";

	candidateList.forEach((item) => {
		allowanceFields.forEach((allowanceField) => { response += `${item[allowanceField]},`; });
		response += `<a target='_blank' href = '${item.candidateUrl}'>${item.candidateUrl}</a>,`;
		response += `<br/>`;
	});
	res.send(response);
});

app.get('/api/list', async (req, res) => {
	let candidateList = await commons.getMarketingCandidateList();

	res.send(candidateList);
});

app.post('/api/update', async (req, res) => {
	try {
		await commons.updateMyworkImportCandidateInfo(req.body, 'MyworkSaveStatus');

		res.send('done');
	} catch (e) {
		console.log(e);
	}
});

function extend(target) {
	var key, obj;

	for (var i = 1, l = arguments.length; i < l; i++) {
		if ((obj = arguments[i])) {
			for (key in obj)
				target[key] = obj[key];
		}
	}

	return target;
}

app.post('/api/upload', async function (req, res, next) {
	let form = new formidable.IncomingForm();
	form.parse(req, async function (err, fields, files) {
		if (err) {
			console.log(err);
			next(err);
		} else {
			try {
				req.files = extend(fields, files);

				let data = await commons.myWorkCandidateInfoExportFileHandling(req.files);
				console.log(`Got ${data.length} items`);
				console.log(data);
				res.send('done');
				await commons.updateMyworkImportCandidateInfo(data, 'MyworkImportStatus');
			} catch (error) {
				res.sendStatus(400);
			}
		}
	});
});

app.get('/api/status', async function (req, res, next) {
	let message = {
		MyworkSaveStatus: await commons.getConfig('MyworkSaveStatus'),
		MyworkImportStatus: await commons.getConfig('MyworkImportStatus')
	};

	res.send(message);
});


app.listen(port, () => {
	console.log(`Server listening at port:${port}`);
});