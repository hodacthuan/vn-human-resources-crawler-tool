const puppeteer = require('puppeteer');
const mainUrl = 'https://www.vietnamworks.com/tim-viec-lam/tat-ca-viec-lam';
const CONFIG = require('../../config');
const JobModel = require('../models/job.model');
const commons = require('../commons/commons');

/**
 * Crawl list of Vietnamwork job
 * 
 * @return {Array} list of Vietnamwork job
 */
const VietnamworkScrape = async () => {
	const browser = await commons.browserConfig();
	const page = await browser.newPage();

	await page.goto(mainUrl);
	var results = [];
	var firstIndexPageNumber = 1;
	var lastPageNumber = 3;

	for (let index = firstIndexPageNumber + 1; index <= lastPageNumber; index++) {
		await page.waitFor(Math.floor(Math.random() * 1000) + 3000);

		let allJobEachPage = await page.evaluate(() => {
			let data = [];
			let elements = document.querySelectorAll('.job-item');
			for (var element of elements) {
				let jobTitle =
					element.children[0].children[0].children[1].children[0].children[0]
						.children[0].innerText;
				let link = element.children[0].children[0].children[1].children[0].children[0].children[0].getAttribute(
					'href'
				);
				let companyTitle = element.children[0].children[0].children[1].children[0]
					.getElementsByClassName('company text-clip')[0]
					.getElementsByClassName('job-search__company')[0].innerHTML;
				let linkArr = link.split('/');
				let jobUrl = 'https://www.vietnamworks.com/' + linkArr[1];
				data.push({ jobTitle, jobUrl, companyTitle });
			}

			// console.log(data);
			return data;
		});

		results = results.concat(allJobEachPage);
		console.log(`Extract page ${index}`);
		await page.click(`ul.ais-pagination > li:nth-child(${index + 2})  > a`);
	}
	await browser.close();
	return results;
};

/**
 * Crawl Vietnamwork job details
 * 
 * @param {*} item job details object
 * @return {*} job details data
 */
const extractedEachjobDetailVietnamworks = async (item) => {
	const browser = await puppeteer.launch({ args: ['--no-sandbox'] });

	const page = await browser.newPage();
	await page.goto(item.jobUrl);
	await page.waitFor(Math.floor(Math.random() * 1000) + 2000);

	//code at fontend
	let data = await page.evaluate(() => {
		let _data = {};
		try {
			_data.jobSalary = document
				.getElementsByClassName('salary')[0]
				.children[0].innerHTML.replace(/\n/g, '');
		} catch (err) {
			_data.jobSalary = null;
		}

		try {
			let data = document.getElementsByClassName('benefits')[0].children;
			let results = [];
			for (i = 0; i < data.length; i++) {
				results.push(data[i].children[1].innerHTML.replace(/\n/g, '').trim());
			}
			_data.jobBenefit = results;
		} catch (err) {
			_data.jobBenefit = [];
		}

		try {
			let data = document
				.getElementsByClassName('job-tags')[0]
				.getElementsByClassName('tags')[0].children;
			let results = [];
			for (i = 0; i < data.length; i++) {
				results.push(
					data[i].children[0].children[0].innerHTML.replace(/\n/g, '').trim()
				);
			}
			_data.jobTags = results;
		} catch (err) {
			_data.jobTags = [];
		}

		try {
			let data = document
				.getElementsByClassName('job-description')[0]
				.children[1].innerHTML.replace(/\n/g, '')
				.trim()
				.split('<br>');
			let results = [];
			for (i = 0; i < data.length; i++) {
				if (data[i].trim().length > 0) {
					results.push(data[i].trim());
				}
			}
			_data.jobDescription = results;
		} catch (err) {
			_data.jobDescription = [];
		}
		try {
			let data = document
				.getElementsByClassName('job-requirements')[0]
				.children[1].innerHTML.replace(/\n/g, '')
				.trim()
				.split('<br>');
			let results = [];
			for (i = 0; i < data.length; i++) {
				if (data[i].trim().length > 0) {
					results.push(data[i].trim());
				}
			}
			_data.jobRequirement = results;
		} catch (err) {
			_data.jobRequirement = [];
		}

		try {
			_data.jobSubmitDate = document
				.getElementsByClassName('box-summary')[0]
				.children[0].children[1].children[1].innerHTML.replace(/\n/g, '')
				.trim();
		} catch (err) {
			_data.jobSubmitDate = null;
		}

		try {
			_data.jobPosition = document
				.getElementsByClassName('box-summary')[0]
				.children[1].children[1].children[1].innerHTML.replace(/\n/g, '')
				.trim();
		} catch (err) {
			_data.jobPosition = null;
		}
		try {
			let data = document.getElementsByClassName('box-summary')[0].children[2]
				.children[1].children[1].children;
			let results = [];
			for (i = 0; i < data.length; i++) {
				results.push(data[i].innerHTML.replace(/\n/g, '').trim());
			}
			_data.jobProfession = results;
		} catch (err) {
			_data.jobProfession = [];
		}

		try {
			let data = document
				.getElementsByClassName('box-summary')[0]
				.children[3].children[1].children[1].innerHTML.replace(/\n/g, '')
				.trim()
				.split(',');
			let results = [];
			for (i = 0; i < data.length; i++) {
				if (data[i].trim().length > 0) {
					results.push(data[i].trim());
				}
			}
			_data.jobSkill = results;
		} catch (err) {
			_data.jobSkill = [];
		}
		try {
			_data.jobLanguage = document
				.getElementsByClassName('box-summary')[0]
				.children[4].children[1].children[1].innerHTML.replace(/\n/g, '')
				.trim();
		} catch (err) {
			_data.jobLanguage = null;
		}

		try {
			let data = document
				.getElementsByClassName('company-info')[0]
				.children[0].innerHTML.replace(/\n/g, '')
				.split('<br>');
			let results = [];
			for (i = 0; i < data.length; i++) {
				if (data[i].trim().length > 0) {
					results.push(data[i].trim());
				}
			}
			_data.companyInfo = results;
		} catch (err) {
			_data.companyInfo = [];
		}
		try {
			_data.companyAddress = document
				.getElementsByClassName('box-summary')[1]
				.children[0].children[1].children[1].innerHTML.replace(/\n/g, '');
		} catch (err) {
			_data.companyAddress = null;
		}
		try {
			_data.companySize = document
				.getElementsByClassName('box-summary')[1]
				.children[1].children[1].children[1].innerHTML.replace(/\n/g, '');
		} catch (err) {
			_data.companySize = null;
		}
		try {
			_data.companyContactName = document
				.getElementsByClassName('box-summary')[1]
				.children[2].children[1].children[1].innerHTML.replace(/\n/g, '');
		} catch (err) {
			_data.companyContactName = null;
		}
		try {
			let data = document.getElementsByClassName('multi-carousel')[0]
				.children[0].children;
			let results = [];
			for (i = 0; i < data.length; i++) {
				results.push(
					data[i].children[0].getAttribute('href').replace(/\n/g, '')
				);
			}
			_data.companyImage = results;
		} catch (err) {
			_data.companyImage = [];
		}
		// let _data = { description, requirement, skill, submitDate, position, language };
		return _data;
	});
	let results = { ...item, ...data };
	await browser.close();
	return results;
};

/**
 * Start Vietnamwork cron jobs
 * 
 */
const crawlJob = async () => {
	console.log('Start job...');
	await VietnamworkScrape().then(async (allJobsRaw) => {
		let allJobs = commons.removeDuplicates(allJobsRaw);
		console.log('Collection length: ' + allJobs.length);
		console.log(allJobs[0]);
		console.log(allJobs[allJobs.length - 1]);
		// console.log(allJobs);

		await allJobs.reduce(function (promise, item) {
			return promise.then(function () {
				return new Promise((resolve, reject) => {
					process.nextTick(async () => {
						//get job to check if it's exits inside database or not
						let getJob = await JobModel.findOne({
							jobUrl: item.jobUrl,
						});

						if (getJob == null) {
							await commons.sleep(Math.floor(Math.random() * 1000) + 1000);
							item.source = 'Vietnamworks';
							item.createdDate = new Date();
							item.updatedDate = new Date();
							let _jobDetail = await extractedEachjobDetailVietnamworks(item);

							let _getCompany = await commons.updateCompany(_jobDetail);
							let _getJob = await commons.updateJob(_getCompany, _jobDetail);
							console.log(_jobDetail);
						}

						resolve();
					});
				});
			});
		}, Promise.resolve());
		console.log('Done scrape!');
	});
};

module.exports = crawlJob;