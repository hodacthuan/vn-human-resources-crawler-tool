const CompanyModel = require('../models/company.model');
const CrontabModel = require('../models/crontab.model');
const JobModel = require('../models/job.model');
const CandidateModel = require('../models/candidate.model');
const ConfigModel = require('../models/config.model');
const CONFIG = require('../../config/config');
const puppeteer = require('puppeteer');
const XLSX = require('xlsx');
const validator = require('validator');

const commons = {
	sleep: (ms) => {
		return new Promise((resolve) => {
			// console.log(`Sleep:${ms}`);
			setTimeout(resolve, ms);
		});
	},

	browserConfig: async () => {
		return await puppeteer.launch({
			args: ['--no-sandbox'],
			executablePath: CONFIG.GOOGLE_CHROME_URL,
		});
	},

	logger: (message) => {
		if (process.env.DEPLOY_ENV == 'local') {
			console.log(message);
		}
	},

	debug: (message) => {
		console.log(message);
	},
};

commons.myworkFilterList = [8, 30, 31, 32, 43, 63, 74, 75];

commons.myWorkCategory = {
	2: "Ngân hàng/ Tài Chính",
	3: "Bảo hiểm/ Tư vấn bảo hiểm",
	4: "Đầu tư",
	5: "Bất động sản",
	6: "Kế toán - Kiểm toán",
	7: "Ngân hàng/ Tài Chính",
	8: "Hành chính - Văn phòng",
	9: "Kiến trúc - Thiết kế nội thất",
	10: "Xây dựng",
	11: "undefined",
	12: "Du lịch",
	13: "Khách sạn - Nhà hàng",
	14: "Công nghiệp",
	15: "Công nghệ cao",
	16: "Công nghiệp",
	17: "Dệt may - Da giày",
	18: "In ấn - Xuất bản",
	19: "Lao động phổ thông",
	20: "Nông - Lâm - Ngư nghiệp",
	21: "Ô tô - Xe máy",
	22: "Thủ công mỹ nghệ",
	23: "Vật tư/Thiết bị/Mua hàng",
	24: "Làm bán thời gian",
	25: "Làm bán thời gian",
	26: "Nhân viên trông quán internet",
	27: "Promotion Girl/ Boy (PG-PB)",
	28: "Sinh viên làm thêm",
	29: "Thực tập",
	30: "Nhân viên kinh doanh",
	31: "Bán hàng",
	32: "Nhân viên kinh doanh",
	33: "Quản trị kinh doanh",
	34: "Xuất - Nhập khẩu",
	35: "IT phần cứng/mạng",
	36: "Games",
	37: "IT phần cứng/mạng",
	38: "IT phần mềm",
	39: "Thiết kế đồ họa - Web",
	40: "Thương mại điện tử",
	41: "Biên tập/ Báo chí/ Truyền hình",
	42: "Biên tập/ Báo chí/ Truyền hình",
	43: "Marketing - PR",
	44: "Tiếp thị - Quảng cáo",
	45: "Tổ chức sự kiện - Quà tặng",
	46: "Bưu chính",
	47: "Bưu chính",
	48: "Điện tử viễn thông",
	49: "Hàng gia dụng",
	50: "Hàng gia dụng",
	51: "Mỹ phẩm - Trang sức",
	52: "Thời trang",
	53: "Thực phẩm - Đồ uống",
	54: "Kỹ thuật ứng dụng",
	55: "Bảo vệ/ An ninh/ Vệ sỹ",
	56: "Phiên dịch/ Ngoại ngữ",
	57: "Dịch vụ",
	58: "Giáo dục - Đào tạo",
	59: "Hàng hải",
	60: "Hàng không",
	61: "Người giúp việc/ Phục vụ/ Tạp vụ",
	62: "Pháp luật/ Pháp lý",
	63: "Tư vấn/ Chăm sóc khách hàng",
	64: "Vận tải - Lái xe/ Tài xế",
	65: "Y tế - Dược",
	66: "undefined",
	67: "Cơ khí - Chế tạo",
	68: "Dầu khí - Hóa chất",
	69: "Điện - Điện tử - Điện lạnh",
	70: "Hóa học - Sinh học",
	71: "Kỹ thuật",
	72: "Kỹ thuật ứng dụng",
	73: "undefined",
	74: "Hành chính - Văn phòng",
	75: "Nhân sự",
	76: "Thư ký - Trợ lý",
	77: "Kỹ thuật",
	78: "Hoạch định - Dự án",
	79: "Ngành nghề khác",
	80: "Nghệ thuật - Điện ảnh",
	81: "Thiết kế - Mỹ thuật",
	82: "Quan hệ đối ngoại",
	83: "undefined",
	84: "Xuất khẩu lao động",
	85: "Startup",
	86: "Freelance",
	87: "undefined",
	88: "QA-QC/ Thẩm định/ Giám định",
	89: "Môi trường",
	90: "Phi chính phủ/ Phi lợi nhuận",
	91: "Lương cao",
	92: "Việc làm cấp cao",
	93: "undefined",
	94: "Công chức - Viên chức",
	95: "Phát triển thị trường",
	96: "undefined",
	97: "undefined",
	98: "Giao nhận/ Vận chuyển/ Kho bãi",
	99: "Làm đẹp/ Thể lực/ Spa",
	100: "Làm đẹp/ Thể lực/ Spa",
	101: "Hàng không",
};


commons.removeDuplicates = (arr) => {
	const result = [];
	const duplicatesIndices = [];

	// Loop through each item in the original array
	arr.forEach((current, index) => {
		if (duplicatesIndices.includes(index)) return;

		result.push(current);

		// Loop through each other item on array after the current one
		for (
			let comparisonIndex = index + 1;
			comparisonIndex < arr.length;
			comparisonIndex++
		) {
			const comparison = arr[comparisonIndex];
			const currentKeys = Object.keys(current);
			const comparisonKeys = Object.keys(comparison);

			// Check number of keys in objects
			if (currentKeys.length !== comparisonKeys.length) continue;

			// Check key names
			const currentKeysString = currentKeys.sort().join('').toLowerCase();
			const comparisonKeysString = comparisonKeys.sort().join('').toLowerCase();
			if (currentKeysString !== comparisonKeysString) continue;

			// Check values
			let valuesEqual = true;
			for (let i = 0; i < currentKeys.length; i++) {
				const key = currentKeys[i];
				if (current[key] !== comparison[key]) {
					valuesEqual = false;
					break;
				}
			}
			if (valuesEqual) duplicatesIndices.push(comparisonIndex);
		} // end for loop
	}); // end arr.forEach()

	return result;
};

commons.updateCompany = async (item) => {
	return new Promise(async (resolve, reject) => {
		let getCompany = await CompanyModel.findOne({
			companyTitle: item.companyTitle,
		});
		//  console.log('getCompany',getCompany);

		if (getCompany == null) {
			const company = new CompanyModel({
				...item,
			});
			await company.save();
			await commons.sleep(Math.floor(Math.random() * 1000) + 500);
			resolve(company);
		} else resolve(getCompany);
	});
};

commons.updateCandidate = async (item) => {
	return new Promise(async (resolve, reject) => {
		try {
			let getCandidate = await CandidateModel.findOne({
				source: item.source,
				candidateUrl: item.candidateUrl,
			});

			const candidate = CandidateModel.findOneAndUpdate({
				source: item.source,
				candidateUrl: item.candidateUrl
			}, {
				$set: { ...item }
			}, {
				new: true,
				upsert: true,
				setDefaultsOnInsert: true
			}).lean().exec();

			await commons.sleep(Math.floor(Math.random() * 1000) + 500);

			let message = getCandidate ? `Update candidate ${item.candidateUrl}` : `Create candidate ${item.candidateUrl}`;
			commons.logger(message);

			resolve(candidate);
		} catch (error) {
			console.log(error);
			reject(error);
		}
	});
};

commons.myworkCandidateProfession = () => {
	let results = [];
	commons.myworkFilterList.forEach((item) => {
		results.push(commons.myWorkCategory[item]);
	});

	return results;
};

commons.getArrayNumber = (a, b) => {
	let c = b - a + 1;
	return Array.from(Array(c), (_, i) => i + a);
};

commons.getMarketingCandidateList = async () => {
	return new Promise(async (resolve, reject) => {
		try {
			let limit = 10000;

			let candidateYearsOfExp = [
				'Chưa có kinh nghiệm',
				'1 năm',
				'2 năm',
				'3 năm'
			];

			let candidateProvinceCity = [
				'Hồ Chí Minh',
				'Hà Nội',
				'Bình Dương',
				'Đà Nẵng',
				'Cần Thơ'
			];

			let candidatePosition = [
				'Nhân viên',
				'Mới tốt nghiệp / Thực tập sinh',
			];

			let candidateProfession = commons.myworkCandidateProfession();

			let resutls = await CandidateModel.find({
				source: 'MyWork',
				candidateProfession: { $in: candidateProfession },
				candidatePosition: { $in: candidatePosition },
				candidateProvinceCity: { $in: candidateProvinceCity },
				candidateDesiredSalaryMax: { $in: commons.getArrayNumber(1, 15) },
				candidateYearsOfExp: { $in: candidateYearsOfExp },
				candidateName: { $exists: true },
				candidateBirthYear: { $in: commons.getArrayNumber(1990, 2003) },
				candidateDistrict: { $exists: true },

				candidateYearsOfExpNum: { $exists: true },
				$and: [
					{
						$or: [
							{
								$and: [
									{ candidateYearsOfExpNum: { $gte: 1 }, },
									{ candidateExperience: { $not: { $size: 0 } } }
								]
							},
							{ candidateYearsOfExpNum: 0 },
						]
					},
					{
						$or: [
							{
								$and: [
									{ candidateBirthYear: { $in: commons.getArrayNumber(1990, 1996) } },
									{ candidateExperience: { $not: { $size: 0 } } }
								]
							},
							{ candidateBirthYear: { $in: commons.getArrayNumber(1997, 2003) } },
						]
					},
				],

			}, {
				'candidateName': true,
				'candidateUrl': true,
				'candidateAvatar': true,
				'candidateBirthYear': true,
				'candidateGender': true,
				'candidateLocation': true,
				'candidateDistrict': true,
				'candidateScore': true,
				'candidateDesiredSalary': true,
				'candidateYearsOfExpNum': true,
				'candidateExperienceLength': true,
				'candidateEducationLength': true,
				'candidatePosition': true,
				'candidatePhone': true,
				'candidateEmail': true,

			})
				.limit(limit)
				.lean().exec();

			resutls.forEach(candidate => {
				let result = candidate;
				result.candidateLocation = candidate.candidateLocation.toString();
				return result;
			});

			resolve(resutls);
		} catch (error) {
			console.log(error);
			reject(error);
		}
	});
};


commons.updateMyworkImportCandidateInfo = async (data, task = null) => {
	let resultArray = [];

	await data.reduce(function (promise, item) {
		return promise.then(function () {
			return new Promise((resolve, reject) => {
				process.nextTick(async () => {
					let itemData = {};
					let allowanceField = ['source', 'candidateUrl', 'candidateEmail', 'candidatePhone'];
					allowanceField.forEach(element => {
						itemData[element] = item[element];
					});

					let results = await commons.updateCandidate(itemData);
					if (task) {
						await commons.updateConfig(task, { message: results.candidateUrl, updated: new Date() });
					}

					resultArray.push(results.candidateUrl);
					resolve();
				});
			});
		});
	}, Promise.resolve());

	if (task) {
		await commons.updateConfig(task, { message: 'Update completed!', updated: new Date() });
	}

	return resultArray;
};

commons.updateJob = async (company, item) => {
	return new Promise(async (resolve, reject) => {
		let getJob = await JobModel.findOne({
			jobUrl: item.jobUrl,
		});

		if (getJob == null) {
			const job = new JobModel({
				...item,
				companyId: company._id,
				companyTitle: company.companyTitle,
			});
			await job.save();
			resolve(job);
		} else {
			resolve(getJob);
		}
	});
};

commons.cleanUpJob = async () => {
	var moment = require('moment');
	var older_than = moment().subtract(CONFIG.REMOVEJOB_DAYS, 'days').toDate();
	JobModel.find({ createdDate: { $lte: older_than } })
		.deleteMany()
		.exec()
		.then((RemoveStatus) => {
			console.log('Documents Removed Successfully');
		})
		.catch((err) => {
			console.error('something error when cleanup');
			console.error(err);
		});
};

commons.showIP = () => {
	var os = require('os');
	var ifaces = os.networkInterfaces();

	Object.keys(ifaces).forEach(function (ifname) {
		var alias = 0;

		ifaces[ifname].forEach(function (iface) {
			if ('IPv4' !== iface.family || iface.internal !== false) {
				// skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
				return;
			}

			if (alias >= 1) {
				// this single interface has multiple ipv4 addresses
				console.log(ifname + ':' + alias, iface.address);
			} else {
				// this interface has only one ipv4 adress
				console.log(ifname, iface.address);
			}
			++alias;
		});
	});
};

commons.getConfig = async (jobName) => {
	return new Promise(async (resolve, reject) => {
		let config = await ConfigModel.findOne({
			id: jobName,
		});
		if (config !== null) {
			resolve(config.data);
		} else {
			resolve(null);
		}
	});
};

commons.updateConfig = async (jobName, data) => {
	return new Promise(async (resolve, reject) => {
		let config = await ConfigModel.findOneAndUpdate({ id: jobName },
			{
				$set: {
					id: jobName,
					data: data
				}
			},
			{
				new: true,
				upsert: true,
				setDefaultsOnInsert: true
			}).lean().exec();

		resolve(config.data);
	});
};

commons.scoreCandidate = (itemDetail) => {
	try {
		let candidateScore = 0;
		let candidateMeetRequirement = true;

		const scoreField = {
			candidateName: 7,
			candidateBirth: 5,
			candidateGender: 5,
			candidatePosition: 7,
			candidateSalary: 3,
			candidateProfile: 5,
			candidateProfession: 7,
			candidateAcademicLevel: 5,
			candidateJobType: 7,
			candidateDesiredSalary: 3,
			candidateYearsOfExp: 3,
			candidateLocation: 7,
			candidateDistrict: 3,
			candidateProvinceCity: 3,
			candidateProfileNum: 1,
			candidateViewNum: 3,
			candidateSkill: 3,
			candidateExperience: 7,
			candidateEducation: 7,
			candidateLanguage: 3,
			candidateAddress: 3,

		};

		const requirementField = [
			'candidateName',
			'candidatePosition',
			'candidateProfession',
			'candidateJobType',
			'candidateLocation',
			'candidateExperience',
			'candidateEducation',
			'candidateDistrict',
		];

		const multiplyArrayField = [
			'candidateExperience',
			'candidateEducation',
		];

		function checkIfExisting(itemDetail, field) {
			return !(itemDetail[field] == null || itemDetail[field] == undefined || ((Array.isArray(itemDetail[field])) && (itemDetail[field].length == 0)));
		}

		function getMultiplyScoreArrayFieldLength(itemDetail, field) {
			if (itemDetail[field] && (Array.isArray(itemDetail[field])) && (itemDetail[field].length > 1) && (multiplyArrayField.includes(field))) {
				return itemDetail[field].length;
			} else {
				return 1;
			}
		}

		requirementField.forEach((field) => {
			if (!checkIfExisting(itemDetail, field)) {
				candidateMeetRequirement = false;
			}
		});

		Object.keys(scoreField).forEach(function (key) {
			if (checkIfExisting(itemDetail, key)) {
				candidateScore += scoreField[key] * getMultiplyScoreArrayFieldLength(itemDetail, key);
			}
		});

		itemDetail.candidateScore = candidateScore;
		itemDetail.candidateMeetRequirement = candidateMeetRequirement;

		return itemDetail;
	} catch (error) {
		console.log(error);
	}
};

commons.myWorkCandidateInfoExportFileHandling = (files) => {
	const keys = Object.keys(files), k = keys[0];
	let data = [];
	keys.forEach((key) => {
		const wb = XLSX.readFile(files[key].path);
		xlsxData = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], {
			header: 1,
			blankrows: false
		});

		xlsxData.forEach(element => {
			try {
				let url = element[7];
				let email = element[4];
				let phone = element[5];
				if (
					validator.isURL(url) &&
					validator.isMobilePhone(phone) &&
					validator.isEmail(email)
				) {
					data.push({
						source: 'MyWork',
						candidateUrl: url,
						candidateEmail: email,
						candidatePhone: phone,
					});
				}
			} catch (error) {
				// console.log(error);
			}
		});
	});

	return data;
};


module.exports = commons;;
