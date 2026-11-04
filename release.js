// Fills in the version details from release.json, which deploy.js writes on every release, and lists the versions
// that can be downloaded. The download button always points at the latest release, so it still works if this file
// can't be read.
(async () => {
  let release;
  try {
    const response = await fetch('release.json', { cache: 'no-store' });
    if (!response.ok) return;
    release = await response.json();
  } catch {
    return;
  }

  const latestExe = document.querySelector('.hero .download').href;
  // A release.json from before the list of versions holds only the latest one.
  const releases = Array.isArray(release.releases) && release.releases.length
    ? release.releases
    : [{ ...release, url: latestExe }];

  const details = (r) => {
    const parts = [];
    const published = new Date(r.published);
    if (!Number.isNaN(published.getTime())) {
      parts.push(published.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }));
    }
    if (r.size) parts.push(`${Math.round(r.size / (1024 * 1024))} MB`);
    return parts;
  };

  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  };

  document.getElementById('release-details').textContent = [`Version ${releases[0].version}`, ...details(releases[0])].join(' · ');
  document.getElementById('release-details').removeAttribute('hidden');

  const list = document.getElementById('version-list');
  releases.forEach((r, index) => {
    const item = element('li', 'version');
    const head = element('div', 'version-head');
    const title = element('h3', null, `Version ${r.version}`);
    if (index === 0) title.append(' ', element('span', 'version-tag', 'Latest'));
    const download = element('a', 'version-download', `Download ${r.version}`);
    download.href = r.url || latestExe;
    head.append(title, download);
    item.append(head);

    const info = details(r);
    if (info.length) item.append(element('p', 'version-details', info.join(' · ')));
    if (r.notes) item.append(element('p', 'version-notes', r.notes));
    if (r.sha256) {
      const checksum = element('p', 'version-checksum', 'SHA-256: ');
      checksum.append(element('code', null, r.sha256));
      item.append(checksum);
    }
    list.append(item);
  });
  document.getElementById('versions').removeAttribute('hidden');
})();
