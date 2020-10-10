const puppeteer = require('puppeteer');
const source = 'MyWork';
const commons = require('../commons/commons');

const maxCategorie = 101;

const mainPageScrape = async (url) => {
	let allJobEachPage = [];
	try {
		const browser = await commons.browserConfig();
		const page = await browser.newPage();

		await page.goto(url);
		await page.waitFor(Math.floor(Math.random() * 1000) + 2000);

		allJobEachPage = await page.evaluate(() => {
			let data = [];
			try {
				let elements = document.getElementsByTagName('table')[0].querySelectorAll('tr'); console.log(elements);

				for (var element of elements) {
					let _data = {};
					let cadidateDetailElement = element.getElementsByTagName('td');
					if (cadidateDetailElement.length) {
						let candidatePosition = cadidateDetailElement[0]
							.getElementsByTagName('p')[0]
							.getElementsByTagName('a')[0].innerText;

						let candidateName = cadidateDetailElement[0]
							.getElementsByTagName('p')[1]
							.innerText;

						let candidateUrl = cadidateDetailElement[0]
							.getElementsByTagName('p')[0]
							.getElementsByTagName('a')[0].href;
						_data.candidatePosition = candidatePosition;
						_data.candidateName = candidateName;
						_data.candidateUrl = candidateUrl;
						data.push({ candidatePosition, candidateName, candidateUrl });
					}
				}
			} catch (err) { }
			return data;
		});

		browser.close();
	} catch (error) {
		console.log('ERROR :: Mywork candidate mainPageScrape fail', error);
	}
	return allJobEachPage;
};

const extractedEachItemDetail = async (item) => {
	try {
		const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
		const page = await browser.newPage();
		await page.goto(item.candidateUrl);
		await page.waitFor(Math.floor(Math.random() * 1000) + 2000);
		//code at fontend
		let data = await page.evaluate(() => {
			let _data = {};

			try {
				let parentElement = document.getElementById('detail-el');
				let data1 = parentElement
					.getElementsByClassName('mw-box-item')[0]
					.getElementsByClassName('info')[0]
					.getElementsByClassName('info-candidate')[0]
					.getElementsByClassName('info-basic')[0]
					.getElementsByClassName('mt-16')[0]
					.getElementsByClassName('col-sm-8')[0]
					.getElementsByTagName('p')[0]
					.innerText.trim();
				_data.candidateBirth = data1;
				_data.candidateBirthYear = Number(data1.split("/")[2]);
			} catch (err) {
				_data.candidateBirth = null;
				_data.candidateBirthYear = 0;
			}
			try {
				let parentElement = document.getElementById('detail-el');
				let data1 = parentElement
					.getElementsByClassName('mw-box-item')[0]
					.getElementsByClassName('info')[0]
					.getElementsByClassName('info-candidate')[0]
					.getElementsByClassName('info-basic')[0]
					.getElementsByClassName('mt-16')[0]
					.getElementsByClassName('col-sm-8')[0]
					.getElementsByTagName('p')[1]
					.innerText.trim();
				_data.candidateAddress = data1;
			} catch (err) {
				_data.candidateAddress = null;
			}
			try {
				let parentElement = document.getElementById('detail-el');
				let data1 = parentElement
					.getElementsByClassName('mw-box-item')[0]
					.getElementsByClassName('info')[0]
					.getElementsByClassName('info-candidate')[0]
					.getElementsByClassName('info-basic')[0]
					.getElementsByClassName('mt-16')[0]
					.getElementsByClassName('col-sm-4')[0]
					.getElementsByTagName('p')[0]
					.innerText.trim();
				_data.candidateGender = data1;
			} catch (err) {
				_data.candidateGender = null;
			}
			try {
				let parentElement = document.getElementById('detail-el');
				let data1 = parentElement
					.getElementsByClassName('mw-box-item')[0]
					.getElementsByClassName('info')[0]
					.getElementsByClassName('info-candidate')[0]
					.getElementsByClassName('info-basic')[0]
					.getElementsByClassName('mt-16')[0]
					.getElementsByClassName('col-sm-4')[0]
					.getElementsByTagName('p')[1]
					.innerText.trim();
				_data.candidateMaritalStatus = data1;
			} catch (err) {
				_data.candidateMaritalStatus = null;
			}

			try {
				let parentElement = document.getElementById('detail-el');
				let data1 = parentElement
					.getElementsByClassName('mw-box-item')[0]
					.getElementsByClassName('info')[0]
					.getElementsByClassName('info-candidate')[0]
					.getElementsByClassName('picture')[0]
					.getElementsByClassName('image-cover')[0]
					.getElementsByClassName('lazy-load')[0].src
					.trim();
				if (!['https://cdn1.mywork.com.vn/default-image/avatar/male_avatar.jpg', 'https://mywork.com.vn/employer-no-image.png'].includes(data1)) {
					_data.candidateAvatar = data1;
				} else {
					_data.candidateAvatar = null;
				}

			} catch (err) {
				_data.candidateAvatar = null;
			}

			try {
				_data.candidateProfession = [];
				_data.candidateLocation = [];
				_data.candidateProfile = [];
				_data.candidateSkill = [];
				_data.candidateLanguage = [];
				_data.candidateEducation = [];
				_data.candidateExperience = [];
				_data.candidateEducationLength = 0;
				_data.candidateExperienceLength = 0;

				parentElement = document.getElementById('detail-el');
				container = parentElement.getElementsByClassName('common-info'); //console.log(container)
				for (k = 0; k < container.length; k++) {
					if (
						container[k]
							.getElementsByClassName('head-title')[0]
							.getElementsByTagName('span')[0]
							.innerText.trim() == 'Thông tin hồ sơ'
					) {
						let profileInfoHTMLList = container[k]
							.getElementsByClassName('content')[0]
							.getElementsByTagName('li');

						for (i = 0; i < profileInfoHTMLList.length; i++) {
							if (
								profileInfoHTMLList[i]
									.getElementsByTagName('strong')[0]
									.innerText.trim() == 'Ngành nghề:'
							) {
								let profileDetailHTMLList = profileInfoHTMLList[
									i
								].getElementsByTagName('span');
								for (j = 0; j < profileDetailHTMLList.length; j++) {
									_data.candidateProfession.push(
										profileDetailHTMLList[j].getElementsByTagName('a')[0]
											.innerText
									);
								}
							}
							if (
								profileInfoHTMLList[i]
									.getElementsByTagName('strong')[0]
									.innerText.trim() == 'Nơi làm việc:'
							) {
								let profileDetailHTMLList = profileInfoHTMLList[
									i
								].getElementsByTagName('span');
								for (j = 0; j < profileDetailHTMLList.length; j++) {
									_data.candidateLocation.push(
										profileDetailHTMLList[j].getElementsByTagName('a')[0]
											.innerText
									);
								}
							}
							if (
								profileInfoHTMLList[i]
									.getElementsByTagName('strong')[0]
									.innerText.trim() == 'Trình độ học vấn:'
							) {
								_data.candidateAcademicLevel = profileInfoHTMLList[i].innerText
									.replace('Trình độ học vấn:', '')
									.trim();
							}
							if (
								profileInfoHTMLList[i]
									.getElementsByTagName('strong')[0]
									.innerText.trim() == 'Loại hình công việc:'
							) {
								_data.candidateJobType = profileInfoHTMLList[i].innerText
									.replace('Loại hình công việc:', '')
									.trim();
							}
							if (
								profileInfoHTMLList[i]
									.getElementsByTagName('strong')[0]
									.innerText.trim() == 'Cấp bậc mong muốn:'
							) {
								_data.candidatePosition = profileInfoHTMLList[i].innerText
									.replace('Cấp bậc mong muốn:', '')
									.trim();
							}
							if (
								profileInfoHTMLList[i]
									.getElementsByTagName('strong')[0]
									.innerText.trim() == 'Mức lương mong muốn:'
							) {
								_data.candidateDesiredSalary = profileInfoHTMLList[i].innerText
									.replace('Mức lương mong muốn:', '')
									.trim();

								let salaryArray = _data.candidateDesiredSalary.split('-');
								salaryArray = salaryArray.map(element => {
									return Number(element.replace("triệu", "").trim());
								});

								_data.candidateDesiredSalaryNums = salaryArray;
								_data.candidateDesiredSalaryMin = Number(salaryArray[0]);
								_data.candidateDesiredSalaryMax = Number(salaryArray[1]);
							}
							if (
								profileInfoHTMLList[i]
									.getElementsByTagName('strong')[0]
									.innerText.trim() == 'Số năm kinh nghiệm:'
							) {
								_data.candidateYearsOfExp = profileInfoHTMLList[i].innerText
									.replace('Số năm kinh nghiệm:', '')
									.trim();

								_data.candidateYearsOfExpNum = Number(_data.candidateYearsOfExp.replace("năm", "").trim()) || 0;
							}
							if (
								profileInfoHTMLList[i]
									.getElementsByTagName('strong')[0]
									.innerText.trim() == 'Quận / huyện:'
							) {
								_data.candidateDistrict = profileInfoHTMLList[i].innerText
									.replace('Quận / huyện:', '')
									.trim();
							}

							if (
								profileInfoHTMLList[i]
									.getElementsByTagName('strong')[0]
									.innerText.trim() == 'Ngày cập nhật:'
							) {
								_data.candidateUpdateTimestamp = profileInfoHTMLList[i].innerText
									.replace('Ngày cập nhật:', '')
									.trim();
							}

							if (
								profileInfoHTMLList[i]
									.getElementsByTagName('strong')[0]
									.innerText.trim() == 'Tỉnh / thành phố:'
							) {
								_data.candidateProvinceCity = profileInfoHTMLList[i].innerText
									.replace('Tỉnh / thành phố:', '')
									.trim();
							}
							if (
								profileInfoHTMLList[i]
									.getElementsByTagName('strong')[0]
									.innerText.trim() == 'Mã hồ sơ:'
							) {
								_data.candidateProfileNum = profileInfoHTMLList[i].innerText
									.replace('Mã hồ sơ:', '')
									.trim();
							}
							if (
								profileInfoHTMLList[i]
									.getElementsByTagName('strong')[0]
									.innerText.trim() == 'Số lượt xem:'
							) {
								_data.candidateViewNum = profileInfoHTMLList[i].innerText
									.replace('Số lượt xem:', '')
									.trim();
							}
						}
					}
					//Mục tiêu nghề nghiệp
					if (
						container[k]
							.getElementsByClassName('head-title')[0]
							.getElementsByTagName('span')[0]
							.innerText.trim() == 'Mục tiêu nghề nghiệp'
					) {
						try {
							_data.candidateProfile.push(
								container[k]
									.getElementsByClassName('content')[0]
									.getElementsByTagName('article')[0].innerText
							);
						} catch { }
						let profileInfoHTMLList = container[k]
							.getElementsByClassName('content')[0]
							.getElementsByTagName('li');
						for (i = 0; i < profileInfoHTMLList.length; i++) {
							_data.candidateProfile.push(
								profileInfoHTMLList[i].innerText.trim()
							);
						}
					}
					//Kỹ năng bản thân
					if (
						container[k]
							.getElementsByClassName('head-title')[0]
							.getElementsByTagName('span')[0]
							.innerText.trim() == 'Kỹ năng bản thân'
					) {
						try {
							_data.candidateSkill.push(
								container[k]
									.getElementsByClassName('content')[0]
									.getElementsByTagName('article')[0].innerText
							);
						} catch { }
						let profileInfoHTMLList = container[k]
							.getElementsByClassName('content')[0]
							.getElementsByTagName('li');
						for (i = 0; i < profileInfoHTMLList.length; i++) {
							_data.candidateSkill.push(
								profileInfoHTMLList[i].innerText.trim()
							);
						}
					}
					//Trình độ ngoại ngữ
					if (
						container[k]
							.getElementsByClassName('head-title')[0]
							.getElementsByTagName('span')[0]
							.innerText.trim()
							.includes('Trình độ ngoại ngữ')
					) {
						let foreignLangHTMLList = container[k]
							.getElementsByClassName('content')[0]
							.getElementsByTagName('li');
						for (i = 0; i < foreignLangHTMLList.length; i++) {
							let language = {};
							language.language = foreignLangHTMLList[i].getElementsByTagName(
								'span'
							)[0].innerText;
							language.level =
								foreignLangHTMLList[i]
									.getElementsByTagName('span')[1]
									.getElementsByClassName('el-icon-star-on').length + '/5';
							_data.candidateLanguage.push(language);
						}
					}

					//Học vấn / bằng cấp
					if (
						container[k]
							.getElementsByClassName('head-title')[0]
							.getElementsByTagName('span')[0]
							.innerText.trim()
							.includes('Học vấn / bằng cấp')
					) {
						let educationHTMLList = container[k]
							.getElementsByClassName('content')[0]
							.getElementsByClassName('item');
						for (i = 0; i < educationHTMLList.length; i++) {
							let education = {};
							try {
								education.period = educationHTMLList[i]
									.getElementsByClassName('time')[0]
									.getElementsByTagName('span')[0]
									.innerText.trim();
							} catch { }
							try {
								education.title = educationHTMLList[i]
									.getElementsByClassName('info')[0]
									.getElementsByTagName('h4')[0]
									.innerText.trim();
							} catch { }
							try {
								education.description = educationHTMLList[i]
									.getElementsByClassName('cert-info')[0]
									.getElementsByClassName('item-desc')[0]
									.innerText.trim();
							} catch { }
							let educationDetailHtmlList = educationHTMLList[i]
								.getElementsByClassName('info')[0]
								.getElementsByTagName('p');
							for (j = 0; j < educationDetailHtmlList.length; j++) {
								if (
									educationDetailHtmlList[j].innerText.includes(
										'Trường / nơi đào tạo:'
									)
								) {
									education.institution = educationDetailHtmlList[j].innerText
										.replace('Trường / nơi đào tạo:', '')
										.trim();
								}
								if (educationDetailHtmlList[j].innerText.includes('Khoa:')) {
									education.faculty = educationDetailHtmlList[j].innerText
										.replace('Khoa:', '')
										.trim();
								}
								if (educationDetailHtmlList[j].innerText.includes('Ngành:')) {
									education.department = educationDetailHtmlList[j].innerText
										.replace('Ngành:', '')
										.trim();
								}
							}

							_data.candidateEducation.push(education);
						}

						_data.candidateEducationLength = _data.candidateEducation.length;
					}

					//Kinh nghiệm làm việc
					if (
						container[k]
							.getElementsByClassName('head-title')[0]
							.getElementsByTagName('span')[0]
							.innerText.trim()
							.includes('Kinh nghiệm làm việc')
					) {
						let educationHTMLList = container[k]
							.getElementsByClassName('content')[0]
							.getElementsByClassName('item');
						for (i = 0; i < educationHTMLList.length; i++) {
							let result = {};
							try {
								result.period = educationHTMLList[i]
									.getElementsByClassName('time')[0]
									.getElementsByTagName('span')[0]
									.innerText.trim();
							} catch { }
							try {
								result.title = educationHTMLList[i]
									.getElementsByClassName('info')[0]
									.getElementsByTagName('h4')[0]
									.innerText.trim();
							} catch { }
							try {
								result.description = educationHTMLList[i]
									.getElementsByClassName('cert-info')[0]
									.getElementsByClassName('item-desc')[0]
									.innerText.trim();
							} catch { }
							let educationDetailHtmlList = educationHTMLList[i]
								.getElementsByClassName('info')[0]
								.getElementsByTagName('p');
							for (j = 0; j < educationDetailHtmlList.length; j++) {
								if (educationDetailHtmlList[j].innerText.includes('Công ty:')) {
									result.company = educationDetailHtmlList[j].innerText
										.replace('Công ty:', '')
										.trim();
								}
							}
							_data.candidateExperience.push(result);
						}

						_data.candidateExperienceLength = _data.candidateExperience.length;
					}
				}
			} catch (err) {
				_data.error = true;
				_data.candidateProfession = [];
				_data.candidateProfile = [];
				_data.candidateSkill = [];
				_data.candidateLocation = [];
				_data.candidateAcademicLevel = null;
				_data.candidateJobType = null;
				_data.candidatePosition = null;
				_data.candidateDesiredSalary = null;
				_data.candidateDesiredSalaryNums = [];
				_data.candidateDesiredSalaryMax = 0;
				_data.candidateDesiredSalaryMin = 0;
				_data.candidateYearsOfExp = null;
				_data.candidateYearsOfExpNum = 0;
				_data.candidateDistrict = null;
				_data.candidateProvinceCity = null;
				_data.candidateProfileNum = null;
				_data.candidateViewNum = null;
				_data.candidateLanguage = [];
				_data.candidateEducationLength = 0;
				_data.candidateExperienceLength = 0;

			}

			return _data;
		});

		Date.prototype.addDays = function (days) {
			var date = new Date(this.valueOf());
			date.setDate(date.getDate() + days);
			return date;
		};

		let currentTime = new Date();
		item.updatedDate = currentTime;
		let results = { ...item, ...data };
		browser.close();
		return results;
	} catch (err) {
		console.log('ERROR :: extractedEachItemDetail', err);
		return undefined;
	}
};

const saveToDB = async (allItemsRaw) => {
	try {
		let allJobs = commons.removeDuplicates(allItemsRaw);
		// console.log('Collection length: ' + allJobs.length);
		// console.log(allJobs[0]);
		// console.log(allJobs[allJobs.length - 1]);
		// console.log(allJobs);

		await allJobs.reduce(function (promise, item) {
			item.source = source;
			return promise.then(function () {
				return new Promise((resolve, reject) => {
					process.nextTick(async () => {
						//get job to check if it's exits inside database or not

						let itemDetail = await extractedEachItemDetail(item);

						itemDetail = commons.scoreCandidate(itemDetail);
						if (itemDetail) {
							await commons.updateCandidate(itemDetail);
							await commons.sleep(Math.floor(Math.random() * 1000) + 1000);
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

const crawlJob = async () => {
	console.log('Start job...');

	while (true) {
		let pageNum = 1;
		let categorieNum = 1;

		let getConfig = await commons.getConfig('MyworkCandidate');

		if (getConfig) {
			pageNum = Number(getConfig.pageNum) || 1;
			categorieNum = Number(getConfig.categorieNum) || 0;
		}

		while (!commons.myworkFilterList.includes(categorieNum) && (categorieNum <= maxCategorie)) {
			pageNum = 1;
			categorieNum++;
		}

		let url = `https://mywork.com.vn/ung-vien/trang/${pageNum}?categories=${categorieNum}`;

		const allItemsRaw = await mainPageScrape(url);
		commons.debug(
			`Page: ${pageNum}/ Category: ${categorieNum}/ Url: ${url}/ Items: ${allItemsRaw.length}`
		);

		if (Array.isArray(allItemsRaw) && allItemsRaw.length == 0) {
			commons.debug('Nothing to scrape');

			if (categorieNum > maxCategorie) {
				commons.debug('Reach max category number -> break');
				break;
				// categorieNum = 0;
			} else {
				commons.debug('Increase category number');
				pageNum = 1;
				categorieNum++;
			}
		} else {
			pageNum++;
			await saveToDB(allItemsRaw);
		}

		await commons.updateConfig('MyworkCandidate', { pageNum, categorieNum });
	}
};

module.exports = crawlJob;
