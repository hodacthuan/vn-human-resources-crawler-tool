const CronJob = require('cron').CronJob;
const vietnamwork = require('./vietnamworks.cron');
const careerbuilder = require('./careerbuilder.cron');
const myworkcandidate = require('./mywork.candidate.cron');
const jobsgoJob = require('./jobsgo.job.cron.js');

// every 4 hour running job
const job = new CronJob('0 */4 * * *', async function () {
    await commons.sleep(Math.floor(Math.random() * 1000 * 60 * 20));
    myworkcandidate();
    vietnamwork();
    careerbuilder();
    commons.cleanUpJob();
});

job.start();