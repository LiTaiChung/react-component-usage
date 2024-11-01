import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

/**
 * UsageAnalyzer class
 * This class analyzes the usage of targets across various pages in a project.
 * It searches for TypeScript (.tsx) component files in a specified directory,
 * checks for their usage in page files, and generates a report in Markdown format.
 */
class UsageAnalyzer {
  /**
   * Constructor for UsageAnalyzer
   * @param {Object} options - Configuration options
   * @param {string} options.name - The name to display in the report header
   * @param {string} options.targetPath - The path to the directory containing targets
   * @param {string} options.pagesPath - The path to the directory containing page files
   */
  constructor({ name = 'Component', targetPath = 'src/elements', pagesPath = 'src/pages' } = {}) {
    this.name = name;
    this.pagesDir = path.join(process.cwd(), pagesPath); // Full path to pages directory
    this.targetsDir = path.join(process.cwd(), targetPath); // Full path to targets directory
    this.targetUsage = {}; // Object to store usage of each target
    this.targetPath = targetPath; // Store targetPath for later use
  }

  /**
   * Runs the usage analysis for targets across page files.
   * This function searches for target exports in target files and
   * checks each page file for their usage, updating the `targetUsage` object.
   */
  run() {
    // Find all .tsx files in targets and pages directories
    const targetFiles = glob.sync(`${this.targetsDir}/*.tsx`);
    const pageFiles = glob.sync(`${this.pagesDir}/**/*.tsx`);

    targetFiles.forEach((targetFile) => {
      const targetName = path.basename(targetFile, '.tsx'); // Get target file name
      console.log(`✨ Processing ${this.name}:`, targetName);

      // Read target file content to check for exports
      const fileContent = fs.readFileSync(targetFile, 'utf8');
      const targetNameMatches = fileContent.match(/export\s+{([^}]+)}/); // Match exports

      if (targetNameMatches) {
        // Extract and filter exported names, checking that they are capitalized
        const targetNames = targetNameMatches[1]
          .split(',')
          .map((name) => name.trim())
          .filter((name) => /^[A-Z]/.test(name));

        // Initialize usage tracking for each target
        targetNames.forEach((targetName) => {
          this.targetUsage[targetName] = [];

          // Check each page file for occurrences of the target
          pageFiles.forEach((pageFile) => {
            const pageName = path.basename(pageFile, '.tsx');
            console.log(`✨✨ Checking page content for target:`, pageName);

            // Read page file content
            const pageContent = fs.readFileSync(pageFile, 'utf8');
            const importRegex = new RegExp(
              `import\\s*\\{?\\s*${targetName}\\s*\\}?\\s*from\\s*['"]@\\/${this.targetPath}\\/[^'"]+['"]|\\b${targetName}\\b`,
              'g',
            );

            // If target is used in the page, add the page path to `targetUsage`
            if (importRegex.test(pageContent)) {
              this.targetUsage[targetName].push(path.relative(process.cwd(), pageFile));
            }
          });
        });
      } else {
        console.log(`No exports found in ${targetName}`);
      }
    });

    console.log('Final Target Usage:', JSON.stringify(this.targetUsage, null, 2));
  }

  /**
   * Generates a Markdown file summarizing target usage.
   * The file is saved in the specified output path or defaults to `tools/usageAnalyzer/usage.md`.
   * @param {string} [outputPath=tools/usageAnalyzer/usage.md] - The path where the Markdown file will be saved.
   */
  generateMarkDown(outputPath = path.join(process.cwd(), 'tools/usageAnalyzer/usage.md')) {
    const header = `# ${this.name} Usage\n\n`;

    const formatUsageEntry = ([targetName, usagePaths]) => {
      const usageList =
        usagePaths.length > 0
          ? usagePaths.map((usage) => `  - [./${usage}](./${usage})`).join('\n')
          : '- Not used in any pages';

      return `## ${targetName}\n${usageList}\n`;
    };

    const markdownData = Object.entries(this.targetUsage).map(formatUsageEntry).join('\n');

    const output = header + markdownData;

    fs.writeFileSync(outputPath, output, 'utf8');
    console.log('Markdown file created:', outputPath);
  }
}

// Example usage with object parameter
const usageAnalyzer = new UsageAnalyzer({
  name: 'Component',
  targetPath: 'src/elements',
  pagesPath: 'src/pages',
});

// Run the analysis
usageAnalyzer.run();

// Generate Markdown report with a custom output path
usageAnalyzer.generateMarkDown();
