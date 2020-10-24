const commons = require('../commons/commons');
const MyworkUtils = require('../utils/mywork.util');
const maxCategorie = 101;
let MyworkCandidate = {};
const puppeteer = require('puppeteer');

/**
 * Crawl all candidate inside the input list and then save to DB
 * 
 * @param {*} page
 * @param {Array} candidateList
 */
MyworkCandidate.crawlListCandidateAndsaveToDB = async (page, allItemsRaw) => {
	try {
		let allJobs = commons.removeDuplicates(allItemsRaw);
		commons.debug('Collection length: ' + allJobs.length);
		commons.debug(allJobs);

		await allJobs.reduce(function (promise, item) {
			return promise.then(function () {
				return new Promise((resolve, reject) => {
					process.nextTick(async () => {
						let itemDetail = await MyworkUtils.myworkEachCandidateDetail(page, item);
						if (itemDetail) {
							itemDetail = MyworkUtils.scoreCandidate(itemDetail);
							if (itemDetail) {
								await commons.updateCandidate(itemDetail);
								await commons.sleep(Math.floor(Math.random() * 100) + 400);
							}
						}
						commons.debug(itemDetail);

						resolve();
					});
				});
			});
		}, Promise.resolve());
	} catch (error) {
		commons.logger(error)
	}
};

/**
 * Get config of page number and category number then crawl them
 */
MyworkCandidate.crawlJob = async () => {
	commons.logger('Start job...');

	const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
	const page = await browser.newPage();

	while (true) {
		let pageNum = 1;
		let categorieNum = 0;

		let getConfig = await commons.getConfig('MyworkCandidate');

		if (getConfig) {
			pageNum = Number(getConfig.pageNum) || 1;
			categorieNum = Number(getConfig.categorieNum) || 0;
		}

		let url = `https://mywork.com.vn/ung-vien/trang/${pageNum}?categories=${categorieNum}`;
		const allItemsRaw = await MyworkUtils.myworkCrawlListofCandidate(page, url);
		commons.logger(`Page: ${pageNum}/ Category: ${categorieNum}/ Url: ${url}/ Items: ${allItemsRaw.length}`);

		if ((Array.isArray(allItemsRaw) && allItemsRaw.length == 0) || (pageNum > 50)) {
			commons.logger('Nothing to scrape');
			pageNum = 1;

			if (categorieNum < maxCategorie) {
				commons.logger('Increase category number, reset page number');
				categorieNum++;
			} else {
				commons.logger('Reach max category number -> Reset');
				categorieNum = 0;
			}

			await commons.updateConfig('MyworkCandidate', { pageNum, categorieNum });
		} else {
			pageNum++;
			await MyworkCandidate.crawlListCandidateAndsaveToDB(page, allItemsRaw);

			await commons.updateConfig('MyworkCandidate', { pageNum, categorieNum });
		}
	}
};

module.exports = MyworkCandidate;