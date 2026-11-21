const SITE = 'https://trash2treasure-app.vercel.app/';
const API = 'https://pwabuilder.com/api';
const BADGE_PATH = '.badges/pwabuilder.json';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
  // Enqueue analysis
  const enqueueUrl = `${API}/analyses/enqueue?url=${encodeURIComponent(SITE)}`;
  const enqueueRes = await fetch(enqueueUrl, { method: 'POST' });
  const analysisId = await enqueueRes.text();
  console.log(`Analysis ID: ${analysisId}`);

  // Poll until complete
  const pollUrl = `${API}/analyses?id=${encodeURIComponent(analysisId)}`;
  let attempts = 0;
  const maxAttempts = 30;

  while (attempts < maxAttempts) {
    await sleep(5000);
    const pollRes = await fetch(pollUrl);
    const data = await pollRes.json();
    const status = data.status;

    if (status === 'Completed') {
      const caps = data.capabilities || [];
      const total = caps.length;
      const passed = caps.filter(c => c.status === 'Passed').length;
      const failed = caps.filter(c => c.status === 'Failed').length;
      const swTotal = caps.filter(c => c.category === 'ServiceWorker').length;
      const swPassed = caps.filter(c => c.category === 'ServiceWorker' && c.status === 'Passed').length;
      const appCaps = caps.filter(c => c.featureName && c.category !== 'ServiceWorker');
      const appPassed = appCaps.filter(c => c.status === 'Passed').length;

      console.log(`Score: ${passed}/${total}`);
      console.log(`SW: ${swPassed}/${swTotal}`);
      console.log(`App Capabilities: ${appPassed}/${appCaps.length}`);

      const badge = {
        schemaVersion: 1,
        label: 'PWABuilder',
        message: `${passed}/${total}`,
        color: passed === total ? 'brightgreen' : passed >= total * 0.8 ? 'green' : passed >= total * 0.6 ? 'yellow' : 'orange',
        cacheSeconds: 86400
      };

      const fs = require('fs');
      const path = require('path');
      const badgePath = path.resolve(__dirname, '..', BADGE_PATH);
      fs.writeFileSync(badgePath, JSON.stringify(badge, null, 2) + '\n');
      console.log(`Badge written to ${badgePath}`);
      return;
    }

    console.log(`Status: ${status} (attempt ${attempts + 1}/${maxAttempts})`);
    attempts++;
  }

  console.error('Analysis did not complete in time');
  process.exit(1);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
