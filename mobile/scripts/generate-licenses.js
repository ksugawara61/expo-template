#!/usr/bin/env node

const checker = require('license-checker');
const fs = require('fs');
const path = require('path');

const outputDir = path.join(__dirname, '../src/data');
const outputFile = path.join(outputDir, 'licenses.json');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

checker.init({
  start: path.join(__dirname, '..'),
  excludePrivatePackages: true,
}, (err, packages) => {
  if (err) {
    console.error('Error generating licenses:', err);
    process.exit(1);
  }

  // Transform the data into a more usable format
  const licenseData = Object.entries(packages).map(([packageName, info]) => {
    // Extract package name and version from the key (format: "package@version")
    const lastAtIndex = packageName.lastIndexOf('@');
    const name = packageName.substring(0, lastAtIndex);
    const version = packageName.substring(lastAtIndex + 1);

    return {
      name,
      version,
      license: info.licenses,
      repository: info.repository,
      publisher: info.publisher,
      email: info.email,
      url: info.url,
      licenseFile: info.licenseFile,
      noticeFile: info.noticeFile,
    };
  }).sort((a, b) => a.name.localeCompare(b.name));

  // Write the data to file
  fs.writeFileSync(outputFile, JSON.stringify(licenseData, null, 2));
  console.log(`Generated ${licenseData.length} license entries to ${outputFile}`);
});