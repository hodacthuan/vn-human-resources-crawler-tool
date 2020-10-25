'use strict';

const puppeteer = require('puppeteer');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const port = 4000;
const cors = require('./src/middlewares/cors');
const router = require('./src/routes');

require('./src/commons/mongodb');
require('./src/crons');

//Global variable
global.token = "";
(async () => {
	global.globalBrowser = await puppeteer.launch({ args: ['--no-sandbox'] });
	global.globalPage = await globalBrowser.newPage();
})();

app.use(bodyParser.json());

app.use(cors);

app.use('/api', router);

app.listen(port, () => {
	console.log(`Server listening at port:${port}`);
});