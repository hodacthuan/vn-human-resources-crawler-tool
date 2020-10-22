const commons = require('../commons/commons');
const MyworkUtils = require('../utils/mywork.util');

const maxCategorie = 101;
let MyworkCandidate = {};

MyworkCandidate.crawlEachItemAndsaveToDB = async (allItemsRaw) => {
	try {
		let allJobs = commons.removeDuplicates(allItemsRaw);
		commons.debug('Collection length: ' + allJobs.length);
		commons.debug(allJobs[0]);
		commons.debug(allJobs[allJobs.length - 1]);
		commons.debug(allJobs);

		await allJobs.reduce(function (promise, item) {
			return promise.then(function () {
				return new Promise((resolve, reject) => {
					process.nextTick(async () => {
						//get job to check if it's exits inside database or not

						let itemDetail = await MyworkUtils.extractedEachItemDetail(item);
						if (itemDetail) {
							itemDetail = MyworkUtils.scoreCandidate(itemDetail);
							if (itemDetail) {
								await commons.updateCandidate(itemDetail);
								await commons.sleep(Math.floor(Math.random() * 100) + 400);
							}
						}
						commons.debug(itemDetail)

						resolve();
					});
				});
			});
		}, Promise.resolve());
	} catch (error) {
		console.log(error);
	}
};

MyworkCandidate.crawlJob = async () => {
	console.log('Start job...');

	while (true) {
		let pageNum = 1;
		let categorieNum = 0;

		let getConfig = await commons.getConfig('MyworkCandidate');

		if (getConfig) {
			pageNum = Number(getConfig.pageNum) || 1;
			categorieNum = Number(getConfig.categorieNum) || 0;
		}

		// while (
		// 	!MyworkUtils.myworkFilterList.includes(categorieNum) &&
		// 	(categorieNum <= maxCategorie)
		// ) {
		// 	pageNum = 1;
		// 	categorieNum++;
		// }

		let url = `https://mywork.com.vn/ung-vien/trang/${pageNum}?categories=${categorieNum}`;
		const allItemsRaw = await MyworkUtils.mainPageScrape(url);
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
			await commons.updateConfig('MyworkCandidate', { pageNum, categorieNum });

			await MyworkCandidate.crawlEachItemAndsaveToDB(allItemsRaw);
		}
	}
};

module.exports = MyworkCandidate;
