const CompanyModel = require('../models/company.model');
const JobModel = require('../models/job.model');
const CandidateModel = require('../models/candidate.model');
const ConfigModel = require('../models/config.model');
const CONFIG = require('../../config/config');
const puppeteer = require('puppeteer');

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

	debug: (message) => {
		if (process.env.DEPLOY_ENV == 'local') {
			console.log(message);
		}
	},

	logger: (message) => {
		console.log(message);
	},
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


commons.getCandidate = async (item) => {
	if (!item.candidateIdFromSource) {
		return
	}

	try {
		let getCandidate = await CandidateModel.findOne({
			source: item.source,
			candidateIdFromSource: item.candidateIdFromSource,
		});

		if (getCandidate) {
			return getCandidate;
		}

		return
	} catch (error) {
		commons.debug(error)
	}
};


commons.updateCandidate = async (item) => {
	if (!item.candidateIdFromSource || !item.candidateUrl) {
		return
	}

	try {
		let getCandidate = await CandidateModel.findOne({
			source: item.source,
			candidateIdFromSource: item.candidateIdFromSource,
		});

		let message = getCandidate ? `Update candidate ${item.candidateIdFromSource}` : `Create candidate ${item.candidateIdFromSource}`;
		commons.logger(message);

		if (!getCandidate) {
			let getCandidateByUrl = await CandidateModel.findOne({
				source: item.source,
				candidateUrl: item.candidateUrl,
			});

			if (getCandidateByUrl) {
				await CandidateModel.findOneAndUpdate({
					source: item.source,
					candidateUrl: item.candidateUrl
				}, {
					$set: { ...item }
				}, {
					new: true,
					upsert: true,
					setDefaultsOnInsert: true
				}).lean().exec();
			}
		}

		let data = await CandidateModel.findOneAndUpdate({
			source: item.source,
			candidateIdFromSource: item.candidateIdFromSource
		}, {
			$set: { ...item }
		}, {
			new: true,
			upsert: true,
			setDefaultsOnInsert: true
		}).lean().exec();

		return data;
	} catch (error) {
		commons.debug('Error because of duplication')
		commons.debug(error)
	}

};


commons.getArrayNumber = (a, b) => {
	let c = b - a + 1;
	return Array.from(Array(c), (_, i) => i + a);
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

commons.fileExtend = (target) => {
	var key, obj;
	for (var i = 1, l = arguments.length; i < l; i++) {
		if ((obj = arguments[i])) {
			for (key in obj)
				target[key] = obj[key];
		}
	}
	return target;
}

module.exports = commons;;
