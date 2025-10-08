import { CronJob } from 'cron';
import https from 'https';

// Send a GET request every 14 minutes so the app stays awake on render-like hosts
const job = new CronJob('*/14 * * * *', () => {
  https
    .get(process.env.API_URL, (res) => {
      if (res.statusCode === 200) console.log('GET request sent successfully');
      else console.log('GET request failed', res.statusCode);
    })
    .on('error', (e) => console.error('Error while sending request', e));
});

export default job;

// Notes:
// Cron expressions are: MIN HOUR DOM MON DOW
// Example: '*/14 * * * *' = every 14 minutes