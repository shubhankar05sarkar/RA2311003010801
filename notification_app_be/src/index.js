import { Log } from 'logging-middleware';
import { fetchNotifications } from './notificationApi.js';
import { getTopNNotifications } from './priorityInbox.js';

const n = parseInt(process.argv[2], 10) || 10;

async function main() {
  await Log('backend', 'info', 'service', `Priority Inbox started, top ${n}`);

  const notifications = await fetchNotifications();
  const topN = await getTopNNotifications(notifications, n);

  await Log('backend', 'info', 'service', `Priority Inbox: top ${topN.length} ready`);

  console.log(`\n=== TOP ${n} PRIORITY NOTIFICATIONS ===\n`);
  topN.forEach((notif, i) => {
    console.log(`${i + 1}. [${notif.Type}] ${notif.Message}`);
    console.log(`   ID: ${notif.ID}`);
    console.log(`   Timestamp: ${notif.Timestamp}\n`);
  });
}

main().catch(async (err) => {
  await Log('backend', 'fatal', 'service', `error: ${err.message}`.slice(0, 48));
  console.error(err);
  process.exit(1);
});
