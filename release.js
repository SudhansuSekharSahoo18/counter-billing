// Fills in the version details from release.json, which deploy.js writes on every release. The download button
// always points at the latest release, so it still works if this file can't be read.
(async () => {
  let release;
  try {
    const response = await fetch('release.json', { cache: 'no-store' });
    if (!response.ok) return;
    release = await response.json();
  } catch {
    return;
  }

  const details = [`Version ${release.version}`];
  const published = new Date(release.published);
  if (!Number.isNaN(published.getTime())) {
    details.push(published.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }));
  }
  if (release.size) details.push(`${Math.round(release.size / (1024 * 1024))} MB`);

  const show = (id) => document.getElementById(id).removeAttribute('hidden');

  document.getElementById('release-details').textContent = details.join(' · ');
  show('release-details');

  if (release.notes) {
    document.getElementById('release-notes').textContent = release.notes;
    show('whats-new');
  }
  if (release.sha256) {
    document.getElementById('checksum-value').textContent = release.sha256;
    show('checksum');
  }
})();
