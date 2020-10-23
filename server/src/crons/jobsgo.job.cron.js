const source = 'JobsGo';
const cronJobName = `${source}_Job`;
const rootUrl = 'https://jobsgo.vn';
const refUrl = 'https://jobsgo.vn/viec-lam.html';
const commons = require('../commons/commons');
const JobModel = require('../models/job.model');
const CompanyModel = require('../models/company.model');
const maxPageNumber = 800;

const mainPageScrape = async (url) => {
	let allItemEachPage = [];
	try {
		const browser = await commons.browserConfig();
		const page = await browser.newPage();

		await page.goto(url);
		await page.waitFor(Math.floor(Math.random() * 1000) + 2000);

		allItemEachPage = await page.evaluate(() => {

			let data = [];
			try {
				let elements = document.querySelectorAll('.item-click');
				for (var element of elements) {

					let elementHtml = element.getElementsByClassName('brows-job-position')[0];

					let jobTitle = elementHtml
						.getElementsByTagName('div')[0]
						.getElementsByTagName('a')[0].innerText;

					let companyTitle = elementHtml
						.getElementsByTagName('p')[0]
						.getElementsByTagName('a')[0].innerText;

					let jobUrl = elementHtml
						.getElementsByTagName('div')[0]
						.getElementsByTagName('a')[0]
						.getAttribute('href');

					data.push({ jobTitle, companyTitle, jobUrl });
				}
			} catch (err) { }

			return data;
		});

		await browser.close();
	} catch (error) {
		console.log(`ERROR :: ${source} candidate mainPageScrape fail`, error);

	}
	return allItemEachPage;
};

const extractedEachItemDetail = async (item) => {
	try {
		console.log(`Extracting item ${item.jobUrl}`);
		const browser = await commons.browserConfig();
		const page = await browser.newPage();
		await page.goto(item.jobUrl);
		await page.waitFor(Math.floor(Math.random() * 1000) + 2000);

		//code at fontend
		let data = await page.evaluate(() => {
			let _data = {};

			// jobTitle, jobSalary, jobExpirationDate
			try {
				let parentElement = document.getElementsByClassName('content-wrapper')[0];
				_data.jobTitle = parentElement
					.getElementsByClassName('panel-body')[0]
					.getElementsByClassName('media')[0]
					.getElementsByClassName('media-heading')[0]
					.innerText.trim();
				_data.jobSalary = parentElement
					.getElementsByClassName('panel-body')[0]
					.getElementsByClassName('media')[0]
					.getElementsByClassName('saraly')[0]
					.innerText.trim();
				_data.jobExpirationDate = parentElement
					.getElementsByClassName('panel-body')[0]
					.getElementsByClassName('media')[0]
					.getElementsByClassName('deadline')[0]
					.innerText.trim() + ' days';
			} catch (err) {
				_data.jobTitle = null;
				_data.jobSalary = null;
				_data.jobExpirationDate = null;
			}

			// jobDescription, jobRequirement, jobBenefit
			try {
				_data.jobDescription = [];
				_data.jobRequirement = [];
				_data.jobBenefit = [];

				let containers = document.getElementsByClassName('content-wrapper')[0]
					.getElementsByClassName('panel-body')[0]
					.getElementsByClassName('content-group');

				for (k = 0; k < containers.length; k++) {

					let parentElementTitle = containers[k].getElementsByClassName('text-semibold')[0].innerText.trim();
					let parentElement = containers[k].getElementsByClassName('clearfix')[0];

					//Mô tả công việc
					if (parentElementTitle == 'Mô tả công việc') {
						let htmlList = parentElement.querySelectorAll('p,li');
						if (htmlList.length) {
							for (i = 0; i < htmlList.length; i++) {
								if (htmlList[i].innerText.trim()) {
									_data.jobDescription.push(
										htmlList[i].innerText.trim()
									);
								}
							}
						} else {
							_data.jobDescription.push(
								parentElement.innerText.trim()
							);
						}
					}

					//Yêu cầu công việc
					if (parentElementTitle == 'Yêu cầu công việc') {
						let htmlList = parentElement.querySelectorAll('p,li');
						if (htmlList.length) {
							for (i = 0; i < htmlList.length; i++) {
								if (htmlList[i].innerText.trim()) {
									_data.jobRequirement.push(
										htmlList[i].innerText.trim()
									);
								}
							}
						} else {
							_data.jobRequirement.push(
								parentElement.innerText.trim()
							);
						}
					}
					//Quyền lợi được hưởng
					if (parentElementTitle == 'Quyền lợi được hưởng') {
						let htmlList = parentElement.querySelectorAll('p,li');
						if (htmlList.length) {
							for (i = 0; i < htmlList.length; i++) {
								if (htmlList[i].innerText.trim()) {
									_data.jobBenefit.push(
										htmlList[i].innerText.trim()
									);
								}
							}
						} else {
							_data.jobBenefit.push(
								parentElement.innerText.trim()
							);
						}
					}
				}
			} catch (err) {
				_data.error = true;
				_data.jobDescription = [];
				_data.jobRequirement = [];
				_data.jobBenefit = [];
			}

			// jobProfession, jobYearsofExperience, jobAddress, jobAcademicDegree
			try {
				_data.jobType = [];
				_data.jobProfession = [];
				_data.jobYearsofExperience = null;
				_data.jobAddress = [];
				_data.jobAcademicDegree = [];

				let containers = document.getElementsByClassName('content-wrapper')[0]
					.getElementsByClassName('panel-body')[0]
					.getElementsByClassName('content-group');

				for (k = 0; k < containers.length; k++) {

					//Kinh nghiệm làm việc
					if (containers[k].getElementsByClassName('box-jobs-info')[0]) {
						let containerItem = containers[k].getElementsByClassName('box-jobs-info')[0].childNodes;
						for (i = 0; i < containerItem.length; i++) {

							try {
								if (containerItem[i].innerText.trim().includes('Địa điểm làm việc')) {
									let dataList = containerItem[i + 2].getElementsByClassName('data')[0].getElementsByTagName('p');
									for (j = 0; j < dataList.length; j++) {
										_data.jobAddress.push(dataList[j].innerText.trim());
									}
								}
							} catch { }

							try {
								if (containerItem[i].innerText.trim().includes('Ngành nghề')) {
									let dataList = containerItem[i + 2].getElementsByTagName('a');
									for (j = 0; j < dataList.length; j++) {
										_data.jobProfession.push(dataList[j].innerText.trim());
									}
								}
							} catch { }

							try {
								if (containerItem[i].innerText.trim().includes('Tính chất công việc')) {
									let dataList = containerItem[i + 2].getElementsByTagName('a');
									for (j = 0; j < dataList.length; j++) {
										_data.jobType.push(dataList[j].innerText.trim());
									}
								}
							} catch { }

							try {
								if (containerItem[i].innerText.trim().includes('Yêu cầu kinh nghiệm')) {
									let dataList = containerItem[i + 2];
									_data.jobYearsofExperience = (dataList.innerText.trim());
								}
							} catch { }

							try {
								if (containerItem[i].innerText.trim().includes('Yêu cầu về bằng cấp')) {
									let dataList = containerItem[i + 2];
									_data.jobAcademicDegree.push(dataList.innerText.trim());
								}
							} catch { }


						}
					}
				}
			} catch (err) {
				_data.error = true;
				_data.jobType = [];
				_data.jobProfession = [];
				_data.jobYearsofExperience = null;
				_data.jobAddress = [];
				_data.jobAcademicDegree = [];
			}

			// company info
			try {

				_data.companyAddress = null;
				_data.companySize = null;
				_data.companyWebsite = null;
				_data.companyInfo = [];
				// _data.companyTitle = null

				let parentElement = document.getElementsByClassName('job-detail-col-2')[0].getElementsByClassName('company-info')[0];

				// _data.companyTitle = document.getElementsByClassName('job-detail-col-2')[0].getElementsByClassName('media-heading')[0].innerText.trim();
				for (j = 0; j < parentElement.getElementsByTagName('p').length; j++) {
					let indexElement = parentElement.getElementsByTagName('p')[j];
					let indexElementString = indexElement.outerHTML.trim();
					if (indexElementString.includes('glyphicon-map-marker')) {
						_data.companyAddress = indexElement.innerText.trim();
					} else if (indexElementString.includes('glyphicon-globe')) {
						_data.companyWebsite = indexElement.innerText.trim();
					} else if (indexElementString.includes('glyphicon-user')) {
						_data.companySize = indexElement.innerText.trim();
					} else {
						_data.companyInfo.push(indexElement.innerText.trim());
					}
				}

			} catch (error) {
				_data.error = true;

				// _data.companyTitle = null
				_data.companyAddress = null;
				_data.companySize = null;
				_data.companyWebsite = null;
				_data.companyInfo = [];
			}

			return _data;
		});

		Date.prototype.addDays = function (days) {
			var date = new Date(this.valueOf());
			date.setDate(date.getDate() + days);
			return date;
		};

		let currentTime = new Date();
		item.createdDate = currentTime;
		item.updatedDate = currentTime;
		let results = { ...item, ...data };
		await browser.close();
		return results;
	} catch (err) {
		console.log('ERROR :: extractedEachItemDetail', err);
		return undefined;
	}
};

const extractedAllItemDetail = async (allItemsRaw) => {
	try {
		let allJobs = commons.removeDuplicates(allItemsRaw);

		await allJobs.reduce(function (promise, item) {
			item.source = source;
			return promise.then(function () {
				return new Promise((resolve, reject) => {
					process.nextTick(async () => {
						//check if it's exits inside database or not
						let getCompany = await CompanyModel.findOne({
							source: item.source,
							companyTitle: item.companyTitle,
						});

						let getJob = await JobModel.findOne({
							source: item.source,
							jobUrl: item.jobUrl,
						});

						if (!(getCompany && getJob)) {
							let iteamDataExtracted = await extractedEachItemDetail(item);

							if (iteamDataExtracted) {
								// console.log(iteamDataExtracted)
								let updatedCompany = undefined;
								if (!getCompany) {
									// Create new company
									updatedCompany = await commons.updateCompany(iteamDataExtracted);
									await commons.sleep(Math.floor(Math.random() * 1000) + 1000);
								} else {
									// UPDATE COMPANY INFO 
								}

								let companyDetail = updatedCompany || getCompany;
								if (!getJob && companyDetail) {
									await commons.updateJob(
										companyDetail,
										iteamDataExtracted
									);
									await commons.sleep(Math.floor(Math.random() * 1000) + 1000);
								} else {
									// UPDATE JOB DETAIL 
								}
							}
						}
						resolve();
					});
				});
			});
		}, Promise.resolve());
	} catch (error) {
		console.log(error);
	}
};

const crawlItemsMainFn = async () => {
	console.log(`Start job...${cronJobName} with URL: ${rootUrl}`);

	let config = await commons.getConfig(cronJobName);
	if (!config) {
		config = await commons.updateConfig(cronJobName, { pageNum: 1 });
	}
	console.log(config);

	let pageNum = config.pageNum;
	while (pageNum < maxPageNumber) {
		await commons.updateConfig(cronJobName, { pageNum });

		let url = `${rootUrl}/viec-lam-trang-${pageNum}.html`;
		console.log(
			`Extracting page ${pageNum} / url: ${url}`
		);

		const allItemsRaw = await mainPageScrape(url);
		// console.log(`Total item in page is ${allItemsRaw.length}`);

		await extractedAllItemDetail(allItemsRaw);
		pageNum++;

	}
};

module.exports = crawlItemsMainFn;
