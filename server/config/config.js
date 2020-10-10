const config = {
	REMOVEJOB_DAYS: 30,
	// MONGODB_URL: `mongodb://${process.env.CRAWL_USER}:${process.env.CRAWL_PASSWORD}@${process.env.SERVICE_NAME}-mongodb.${process.env.SERVICE_NAME}-network:27017/${process.env.CRAWL_NAME}`,
	MONGODB_URL: `mongodb://crawl-user:crawl-password@mongodb.joco.asia:27018/crawl-database`,
	GOOGLE_CHROME_URL: '/usr/bin/google-chrome-stable',
};
// console.log(config.MONGODB_URL);

module.exports = config;
