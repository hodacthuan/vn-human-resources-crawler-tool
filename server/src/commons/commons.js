const CompanyModel = require('../models/company.model');
const JobModel = require('../models/job.model');
const CandidateModel = require('../models/candidate.model');
const ConfigModel = require('../models/config.model');
const CONFIG = require('../../config/config');
const puppeteer = require('puppeteer');
const moment = require('moment');

/**
 * Init commons object
 * 
 */
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

/**
 * Remove duplicate in an array of object
 * 
 */
commons.removeDuplicates = (arr) => {
	const result = [];
	const duplicatesIndices = [];

	arr.forEach((current, index) => {
		if (duplicatesIndices.includes(index)) return;

		result.push(current);

		for (
			let comparisonIndex = index + 1;
			comparisonIndex < arr.length;
			comparisonIndex++
		) {
			const comparison = arr[comparisonIndex];
			const currentKeys = Object.keys(current);
			const comparisonKeys = Object.keys(comparison);

			if (currentKeys.length !== comparisonKeys.length) continue;

			const currentKeysString = currentKeys.sort().join('').toLowerCase();
			const comparisonKeysString = comparisonKeys.sort().join('').toLowerCase();
			if (currentKeysString !== comparisonKeysString) continue;

			let valuesEqual = true;
			for (let i = 0; i < currentKeys.length; i++) {
				const key = currentKeys[i];
				if (current[key] !== comparison[key]) {
					valuesEqual = false;
					break;
				}
			}
			if (valuesEqual) duplicatesIndices.push(comparisonIndex);
		}
	});

	return result;
};

/**
 * Update company document in MongoDB
 * 
 * @param {*} item company object data
 */
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

/**
 * Get candidate data from MongoDB from object.candidateIdFromSource
 * 
 * @param {*} item init candidate object
 * @return {*} candidate data
 */
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

/**
 * Update candidate document in MongoDB
 * 
 * @param {*} item candidate object data
 */
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

/**
 * Return an array of number from a->b
 * 
 * @param {Number} a from number
 * @param {Number} b to number
 * @return {Array} the array of number from a to b
 */
commons.getArrayNumber = (a, b) => {
	let c = b - a + 1;
	return Array.from(Array(c), (_, i) => i + a);
};

/**
 * Update job document in MongoDB
 * 
 * @param {*} company
 * @param {*} item
 */
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

/**
 * Clean up job collection
 */
commons.cleanUpJob = async () => {
	let olderThan = moment().subtract(CONFIG.REMOVEJOB_DAYS, 'days').toDate();
	JobModel.find({ createdDate: { $lte: olderThan } })
		.deleteMany()
		.exec()
		.then((RemoveStatus) => {
			console.log('Documents Removed Successfully');
		})
		.catch((err) => {
			console.error('Something error when cleanup');
			console.error(err);
		});
};

/**
 * Console client IP Address
 */
commons.showIP = () => {
	let os = require('os');
	let ifaces = os.networkInterfaces();

	Object.keys(ifaces).forEach(function (ifname) {
		let alias = 0;

		ifaces[ifname].forEach(function (iface) {
			if ('IPv4' !== iface.family || iface.internal !== false) {
				return;
			}

			if (alias >= 1) {
				console.log(ifname + ':' + alias, iface.address);
			} else {
				console.log(ifname, iface.address);
			}
			++alias;
		});
	});
};

/**
 * Get configuration data from MongoDB
 * 
 * @param {String} jobName
 * @return {*} data configuration
 */
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

/**
 * Update configuration to MongoDB by jobName
 * 
 * @param {String} jobName
 * @param {*} data configuration data
 */
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

/**
 * For file uploaded handling
 */
commons.fileExtend = (target) => {
	let key, obj;
	for (let i = 1, l = arguments.length; i < l; i++) {
		if ((obj = arguments[i])) {
			for (key in obj)
				target[key] = obj[key];
		}
	}
	return target;
}

module.exports = commons;;
