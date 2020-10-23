'use strict';

const puppeteer = require('puppeteer');
const commons = require('./src/commons/commons');
const MyworkUtils = require('./src/utils/mywork.util');
const request = require('request');
const CONFIG = require('./config/config');
const formidable = require('formidable');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const port = 4000;

require('./src/commons/mongodb');
require('./src/crons');

global.token = "";

(async () => {
	global.globalBrowser = await puppeteer.launch({ args: ['--no-sandbox'] });
	global.globalPage = await globalBrowser.newPage();
})();


app.use(bodyParser.json());

app.use(function (req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);

	next();
});

app.get('/api/list', async (req, res) => {
	let candidateList = await MyworkUtils.getMarketingCandidateList();

	res.send(candidateList);
});

app.post('/api/update', async (req, res) => {
	try {
		await MyworkUtils.updateMyworkImportCandidateInfo(req.body, 'MyworkSaveStatus');

		res.send('done');
	} catch (e) {
		console.log(e);
	}
});

function fileExtend(target) {
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
				let data = await MyworkUtils.candidateInfoExportFileHandling(fileExtend(files));
				console.log(`Got ${data.length} items`);
				console.log(data);
				res.send('done');
				await MyworkUtils.updateMyworkImportCandidateInfo(data, 'MyworkImportStatus');
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

app.post('/api/mywork/crawl', async function (req, res, next) {
	try {
		let urls = req.body.data;
		if (!(urls) || !urls.length) {
			res.send('Error: Urls not exist in body');
		}

		let response = await MyworkUtils.myworkCrawlDataByUrls(urls);
		res.send(response);
	} catch (error) {
		res.send(error);
	}
});

app.listen(port, () => {
	console.log(`Server listening at port:${port}`);
});