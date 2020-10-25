const CronJob = require('cron').CronJob;
const vietnamwork = require('./vietnamworks.cron');
const careerbuilder = require('./careerbuilder.cron');
const myworkcandidate = require('./mywork.candidate.cron');
const jobsgoJob = require('./jobsgo.job.cron.js');

myworkcandidate.crawlJob();