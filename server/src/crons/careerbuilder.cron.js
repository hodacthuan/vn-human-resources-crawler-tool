const puppeteer = require('puppeteer');
const mainUrl = 'https://careerbuilder.vn/viec-lam/tat-ca-viec-lam-vi.html';
const source = 'Careerbuilder';
const JobModel = require('../models/job.model');
const CompanyModel = require('../models/company.model');
const commons = require('../commons/commons');

/**
 * Crawl the list of Careerbuilder companies
 * 
 * @param {*} item init companies object
 * @return {*} companies list
 */
const mainPageScrape = async () => {
	const browser = await commons.browserConfig();
	const page = await browser.newPage();

	await page.goto(mainUrl);
	let results = [];
	let firstIndexPageNumber = 1;
	let lastPageNumber = 2;

	for (let index = firstIndexPageNumber + 1; index <= lastPageNumber; index++) {
		await page.waitFor(Math.floor(Math.random() * 1000) + 3000);

		let allJobEachPage = await page.evaluate(() => {
			let data = [];
			let elements = document.querySelectorAll('.jobtitle');
			for (let element of elements) {
				let _data = {};
				try {
					let jobTitle = element.getElementsByClassName('job')[0].children[0]
						.innerText;
					let jobUrl = element
						.getElementsByClassName('job')[0]
						.children[0].getAttribute('href');
					let companyTitle = element.getElementsByClassName('namecom')[0]
						.children[0].innerText;
					let companyUrl = element
						.getElementsByClassName('namecom')[0]
						.children[0].getAttribute('href');
					_data.jobTitle = jobTitle;
					_data.jobUrl = jobUrl;
					_data.companyTitle = companyTitle;
					_data.companyUrl = companyUrl;
					// data.push(_data);
					data.push({ jobTitle, jobUrl, companyTitle, companyUrl });
				} catch (err) { }
			}

			return data;
		});

		results = results.concat(allJobEachPage);
		console.log(`Extract page ${index}`);
		await page.click(`div.paginationTwoStatus > a`);
	}
	await browser.close();
	return results;
};

/**
 * Crawl Careerbuilder jobs details object
 * 
 * @param {*} item init job object
 * @return {*} job data
 */
const extractedEachjobDetail = async (item) => {
	const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
	const page = await browser.newPage();
	await page.goto(item.jobUrl);
	await page.waitFor(Math.floor(Math.random() * 1000) + 2000);
	//code at fontend
	let data = await page.evaluate(() => {
		let _data = {};
		try {
			let data = document.getElementsByClassName('DetailJobNew')[0].children,
				container = [],
				jobLocation = '',
				jobPosition = '',
				jobYearsofExperience = '',
				jobSalary = '',
				jobExpiredDate = '',
				jobProfession = [];
			for (i = 0; i < data.length; i++) {
				for (j = 0; j < data[i].children.length; j++) {
					container.push(data[i].children[j]);
					let element = data[i].children[j];
					if (element.children[0].innerHTML == 'Nơi làm việc: ') {
						jobLocation = element.children[1].children[1].innerHTML;
					}
					if (element.children[0].innerHTML == 'Cấp bậc: ') {
						jobPosition = element.children[1].innerHTML;
					}
					if (element.children[0].innerHTML == 'Kinh nghiệm: ') {
						jobYearsofExperience = element.innerHTML
							.split('</span>')[1]
							.replace(/\n/g, '')
							.trim();
					}
					if (element.children[0].innerHTML == 'Lương: ') {
						jobSalary = element.children[1].innerHTML;
					}

					if (element.children[0].innerHTML == 'Ngành nghề: ') {
						data_ = element.children[1].children;
						let results = [];
						for (k = 0; k < data_.length; k++) {
							results.push(
								data_[k].innerHTML.replace(/\n/g, '').replace(',', '').trim()
							);
						}
						jobProfession = results;
					}
					if (element.children[0].innerHTML == 'Hết hạn nộp: ') {
						jobExpiredDate = element.innerHTML
							.split('</span>')[1]
							.replace(/\n/g, '')
							.trim();
					}
				}
			}

			console.log({
				jobLocation,
				jobPosition,
				jobYearsofExperience,
				jobSalary,
				jobProfession,
				jobExpiredDate,
			});
			console.log(container);
			console.log(data);
			_data.jobLocation = jobLocation;
			_data.jobPosition = jobPosition;
			_data.jobYearsofExperience = jobYearsofExperience;
			_data.jobSalary = jobSalary;
			_data.jobProfession = jobProfession;
			_data.jobExpiredDate = jobExpiredDate;
		} catch (err) {
			_data.jobLocation = null;
			_data.jobPosition = null;
			_data.jobYearsofExperience = null;
			_data.jobSalary = null;
			_data.jobProfession = [];
			_data.jobExpiredDate = null;
		}

		try {
			let data = document.getElementsByClassName('list-benefits')[0].children;
			let results = [];
			for (i = 0; i < data.length; i++) {
				results.push(
					data[i].innerHTML.replace(/\n/g, '').trim().split('</i> ')[1]
				);
			}
			_data.jobBenefit = results;
		} catch (err) {
			_data.jobBenefit = [];
		}

		try {
			let container = document.getElementsByClassName('MarBot20');
			for (k = 0; k < container.length; k++) {
				if (container[k].children[0].innerHTML == 'Mô tả Công việc') {
					let data = container[k].children[1].children;
					if (data.length == 1) {
						_data.jobDescription = data.replace(/\n/g, '').trim().split('<br>');
					} else {
						let results = [];
						for (i = 0; i < data.length; i++) {
							results.push(data[i].innerHTML.replace(/\n/g, '').trim());
						}
						_data.jobDescription = results;
					}
				}
			}
		} catch (err) {
			_data.jobDescription = [];
		}

		try {
			let container = document.getElementsByClassName('MarBot20');
			for (k = 0; k < container.length; k++) {
				if (container[k].children[0].innerHTML == 'Yêu Cầu Công Việc') {
					let data = container[k].children[1].children;
					if (data.length == 1) {
						_data.jobRequirement = data
							.replace(/\n/g, '')
							.trim()
							.replace(/&nbsp;/g, '')
							.split('<br>');
					} else {
						let results = [];
						for (i = 0; i < data.length; i++) {
							results.push(
								data[i].innerHTML
									.replace(/\n/g, '')
									.trim()
									.replace(/&nbsp;/g, '')
							);
						}
						_data.jobRequirement = results;
					}
				}
			}
		} catch (err) {
			_data.jobRequirement = [];
		}

		try {
			let data = document.getElementsByClassName('tagskilldetail')[0].children;
			let results = [];
			for (i = 1; i < data.length; i++) {
				results.push(data[i].innerHTML.replace(/\n/g, '').trim());
			}
			_data.jobTags = results;
			_data.jobSkill = results;
		} catch (err) {
			_data.jobTags = [];
			_data.jobSkill = [];
		}

		try {
			_data.jobSubmitDate = document
				.getElementsByClassName('datepost')[0]
				.getElementsByTagName('span')[0]
				.innerHTML.replace(/\n/g, '')
				.trim();
		} catch (err) {
			_data.jobSubmitDate = null;
		}

		return _data;
	});

	item.createdDate = new Date();
	item.updatedDate = new Date();
	let results = { ...item, ...data };
	await browser.close();
	return results;
};

/**
 * Crawl Careerbuilder company details object
 * 
 * @param {*} item init company object
 * @return {*} company data
 */
const extractedEachCompanyDetail = async (item) => {
	try {
		const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
		const page = await browser.newPage();
		await page.goto(item.companyUrl);
		await page.waitFor(Math.floor(Math.random() * 1000) + 2000);
		//code at fontend
		let data = await page.evaluate(() => {
			let _data = {};

			try {
				let data = document
					.getElementsByClassName('gt_area')[0]
					.getElementsByClassName('title')[0]
					.getElementsByTagName('p')[0].innerHTML;
				let rep = data.replace('Địa điểm: ', '');
				_data.companyAddress = rep;
			} catch (err) {
				_data.companyAddress = null;
			}

			try {
				let data = document
					.getElementsByClassName('gt_area')[0]
					.getElementsByClassName('title')[0]
					.getElementsByClassName('mhweb')[0]
					.getElementsByTagName('span')[0].innerHTML;
				if (data.includes('Qui mô công ty: ')) {
					let rep = data.replace('Qui mô công ty: ', '');
					_data.companySize = rep;
				} else {
					_data.companySize = null;
				}
			} catch (err) {
				_data.companySize = null;
			}

			try {
				let data = document.getElementsByClassName('bn_area')[0].children;
				let results = [];
				for (i = 0; i < data.length; i++) {
					results.push(data[i].getAttribute('src').replace(/\n/g, '').trim());
				}
				_data.companyImage = results;
			} catch (err) {
				_data.companyImage = [];
			}
			try {
				let data = document.getElementsByClassName('content_fck')[0].children;
				let results = [];
				for (i = 0; i < data.length; i++) {
					if (data[i].innerHTML.length > 0) {
						results.push(data[i].innerHTML.replace(/\n/g, '').trim());
					}
				}
				_data.companyInfo = results;
			} catch (err) {
				_data.companyInfo = [];
			}
			return _data;
		});

		item.createdDate = new Date();
		item.updatedDate = new Date();
		let results = { ...item, ...data };
		await browser.close();
		return results;
	} catch (err) {
		console.log('ERROR');
		return undefined;
	}
};

/**
 * Start Careerbuilder cron jobs
 * 
 */
const crawlJob = async () => {
	console.log('Start job...');
	await mainPageScrape().then(async (allJobsRaw) => {

		let allJobs = commons.removeDuplicates(allJobsRaw);
		console.log('Collection length: ' + allJobs.length);
		console.log(allJobs);

		await allJobs.reduce(function (promise, item) {
			item.source = source;
			return promise.then(function () {
				return new Promise((resolve, reject) => {
					process.nextTick(async () => {
						//get job to check if it's exits inside database or not

						let getCompany = await CompanyModel.findOne({
							source: item.source,
							companyTitle: item.companyTitle,
						});
						let updatedCompany = undefined;
						if (getCompany == null) {
							let _companyDetail = await extractedEachCompanyDetail(item);
							if (_companyDetail) {
								// console.log(_companyDetail)
								updatedCompany = await commons.updateCompany(_companyDetail);
								await commons.sleep(Math.floor(Math.random() * 1000) + 1000);
							}
						} else {
							updatedCompany = await commons.updateCompany(item);
						}

						if (updatedCompany) {
							let getJob = await JobModel.findOne({
								source: item.source,
								jobUrl: item.jobUrl,
							});

							if (getJob == null) {
								let _jobDetail = await extractedEachjobDetail(item);
								let updateJob = await commons.updateJob(
									updatedCompany,
									_jobDetail
								);
								await commons.sleep(Math.floor(Math.random() * 1000) + 1000);
								commons.debug(_jobDetail);
							}
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