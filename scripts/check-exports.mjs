// Simple import-check script: exit non-zero if import fails
try {
  const cron = await import('../src/config/cron.js');
  if (!cron || (!cron.default && Object.keys(cron).length === 0)) {
    console.error('cron.js did not export a default (or any) export');
    process.exit(2);
  }
  console.log('cron.js import OK');
  process.exit(0);
} catch (e) {
  console.error('Failed to import cron.js:', e);
  process.exit(1);
}
