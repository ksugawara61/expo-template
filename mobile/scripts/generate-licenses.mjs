#!/usr/bin/env node
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.join(__dirname, "../src/features/License");
const outputFile = path.join(outputDir, "licenses.json");

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

try {
  // Execute pnpm licenses command to get license information
  const result = execSync("pnpm licenses list --json --long", {
    cwd: path.join(__dirname, ".."),
    encoding: "utf8",
  });

  const licensesByType = JSON.parse(result);

  // Transform the data into a flat array format for easier consumption
  const licenseData = [];

  for (const [licenseType, packages] of Object.entries(licensesByType)) {
    for (const pkg of packages) {
      // Handle multiple versions of the same package
      for (const version of pkg.versions) {
        licenseData.push({
          name: pkg.name,
          version,
          license: licenseType,
          repository: pkg.homepage,
          publisher: pkg.author,
          url: pkg.homepage,
          description: pkg.description,
        });
      }
    }
  }

  // Sort by package name
  licenseData.sort((a, b) => a.name.localeCompare(b.name));

  // Write the data to file
  fs.writeFileSync(outputFile, JSON.stringify(licenseData, null, 2));
  console.log(
    `Generated ${licenseData.length} license entries to ${outputFile}`,
  );
} catch (error) {
  console.error("Error generating licenses:", error.message);
  process.exit(1);
}
