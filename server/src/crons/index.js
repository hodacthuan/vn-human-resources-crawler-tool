const CronJob = require('cron').CronJob;
const vietnamwork = require('./vietnamworks.cron');
const careerbuilder = require('./careerbuilder.cron');
const myworkcandidate = require('./mywork.candidate.cron');
const jobsgoJob = require('./jobsgo.job.cron.js');

//each 4 hours run a job
//in each job ramdom wait from 0-1 hour before run

// every 4 hour running job
const job = new CronJob('0 */4 * * *', async function () {
    // await commons.sleep(Math.floor(Math.random() * 1000 * 60 * 20));
    // myworkcandidate();
    // vietnamwork();
    // careerbuilder();
    // commons.cleanUpJob();
});
job.start();
// vietnamwork();
// careerbuilder();
// jobsgoJob();
//  careerbuilder();
// vietnamwork();

// var d = new Date();
// var n = d.getHours();
// console.log(Math.round((n/24)*5));
// for (i=0;i<24;i++){
//     console.log(i,Math.round((i/24)*5) )
// }

myworkcandidate.crawlJob();