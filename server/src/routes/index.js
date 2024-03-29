const express = require('express');
const router = express.Router();
const commons = require('../commons/commons');
const MyworkUtils = require('../utils/mywork.util');
const formidable = require('formidable');

/**
 * Return server status
 */
router.get('/status', async function (req, res, next) {

    res.send({
        statusCode: 200,
        message: 'Server up and running!'
    });
});

/**
 * Return custom Mywork candidate list
 */
router.get('/mywork/list', async (req, res) => {
    let candidateList = await MyworkUtils.getMarketingCandidateList();

    res.send(candidateList);
});

/**
 * Update mywork candidate info from frontend
 */
router.post('/mywork/update', async (req, res) => {
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

/**
 * Upload file crawled from mywork then handle it and save to DB
 */
router.post('/mywork/upload', async function (req, res, next) {
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

/**
 * Return crawl status
 */
router.get('/mywork/status', async function (req, res, next) {
    let message = {
        MyworkSaveStatus: await commons.getConfig('MyworkSaveStatus'),
        MyworkImportStatus: await commons.getConfig('MyworkImportStatus')
    };

    res.send(message);
});

/**
 * Crawl mywork candidate by urls
 */
router.post('/mywork/crawl', async function (req, res, next) {

    try {
        let urls = req.body.urls;
        if (!(urls) || !urls.length) {
            res.send('Error: Urls not exist in body');
        }

        let data = await MyworkUtils.myworkCrawlDataByUrls(urls);
        let statusCode = 400;
        let message = "";

        if (data && data.length > 0) {
            statusCode = 200;
            message = "Data crawled successfully!";
        }

        res.send({
            statusCode,
            message,
            data
        });
    } catch (error) {
        res.send(error);
    }
});


module.exports = router;