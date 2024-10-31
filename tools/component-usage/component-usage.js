import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

// 指定 components 和 pages 的文件夾路徑
const componentsDir = path.join(process.cwd(), 'src', 'components', 'ui');
const pagesDir = path.join(process.cwd(), 'src', 'pages');

// 搜索並匹配 .tsx 文件
const componentFiles = glob.sync(`${componentsDir}/*.tsx`);
const pageFiles = glob.sync(`${pagesDir}/**/*.tsx`);

// 用於存儲 component 使用情況的對象
const componentUsage = {};

// 讀取每個 component 文件
componentFiles.forEach((componentFile) => {
  const componentName = path.basename(componentFile, '.tsx'); // 取得 component 文件名
  console.log('✨ Processing component:', componentName);

  const fileContent = fs.readFileSync(componentFile, 'utf8');
  const componentNameMatches = fileContent.match(/export\s+{([^}]+)}/); // Match exports

  if (componentNameMatches) {
    const componentNames = componentNameMatches[1]
      .split(',')
      .map((name) => name.trim())
      .filter((name) => /^[A-Z]/.test(name)); // Filter for capitalized names

    componentNames.forEach((componentName) => {
      componentUsage[componentName] = [];

      // Read each page file to check for component usage
      pageFiles.forEach((pageFile) => {
        const pageName = path.basename(pageFile, '.tsx'); // 取得 component 文件名
        console.log(`✨✨ Checking page content for component:`, pageName);

        const pageContent = fs.readFileSync(pageFile, 'utf8');
        const importRegex = new RegExp(
          `import\\s*\\{?\\s*${componentName}\\s*\\}?\\s*from\\s*['"]@\\/components\\/ui\\/[^'"]+['"]|\\b${componentName}\\b`,
          'g',
        );

        if (importRegex.test(pageContent)) {
          componentUsage[componentName].push(path.relative(process.cwd(), pageFile));
        }
      });
    });
  } else {
    console.log(`No exports found in ${componentName}`);
  }
});

console.log('Final Component Usage:', JSON.stringify(componentUsage, null, 2));

/**
 * ======================
 * Excalidraw
 * ======================
 */
// 創建 Excalidraw 圖形數據
const excalidrawData = {
  type: 'excalidraw',
  version: 2,
  source: 'https://marketplace.visualstudio.com/items?itemName=pomdtr.excalidraw-editor',
  elements: [],
};

let x = 0,
  y = 0;

Object.keys(componentUsage).forEach((component) => {
  const componentId = component;

  // 創建 component 方塊
  excalidrawData.elements.push({
    type: 'rectangle',
    version: 1,
    versionNonce: Math.floor(Math.random() * 100000),
    isDeleted: false,
    id: componentId,
    fillStyle: 'solid',
    strokeWidth: 1,
    strokeStyle: 'solid',
    roughness: 1,
    opacity: 100,
    angle: 0,
    x,
    y,
    strokeColor: '#000000',
    backgroundColor: '#f3f3f3',
    width: 200,
    height: 50,
    seed: Math.floor(Math.random() * 100000),
    groupIds: [],
    frameId: null,
    roundness: null,
    boundElements: [],
    updated: Date.now(),
    link: null,
    locked: false,
  });

  // 添加 component 名稱的文本元素
  excalidrawData.elements.push({
    type: 'text',
    version: 1,
    versionNonce: Math.floor(Math.random() * 100000),
    isDeleted: false,
    id: `${componentId}-label`,
    fillStyle: 'hachure',
    strokeWidth: 1,
    strokeStyle: 'solid',
    roughness: 1,
    opacity: 100,
    angle: 0,
    x: x + 10, // 調整文本位置
    y: y + 15, // 調整文本位置
    strokeColor: '#000000',
    backgroundColor: 'transparent',
    width: 200,
    height: 30,
    seed: Math.floor(Math.random() * 100000),
    groupIds: [],
    frameId: null,
    roundness: null,
    boundElements: [],
    updated: Date.now(),
    link: null,
    locked: false,
    fontSize: 16,
    fontFamily: 1,
    text: componentId, // 顯示組件名稱
    textAlign: 'left',
    verticalAlign: 'top',
    containerId: null,
    originalText: componentId,
    lineHeight: 1.875,
    baseline: 19,
  });

  let pageYOffset = y + 60;

  componentUsage[component].forEach((usage, index) => {
    // 根據頁面名稱的字數調整外框寬度
    const boxWidth = Math.max(200, usage.length * 10 + 20); // 計算外框的寬度

    // 創建頁面文件名稱的外框矩形
    excalidrawData.elements.push({
      type: 'rectangle',
      version: 1,
      versionNonce: Math.floor(Math.random() * 100000),
      isDeleted: false,
      id: `${componentId}-page-${index}-box`,
      fillStyle: 'solid',
      strokeWidth: 1,
      strokeStyle: 'solid',
      roughness: 1,
      opacity: 100,
      angle: 0,
      x: x + 220, // 外框的 X 坐標
      y: pageYOffset,
      strokeColor: '#000000',
      backgroundColor: '#f3f3f3',
      width: boxWidth, // 使用計算的寬度
      height: 30, // 根據文本高度設置外框高度
      seed: Math.floor(Math.random() * 100000),
      groupIds: [],
      frameId: null,
      roundness: null,
      boundElements: [],
      updated: Date.now(),
      link: null,
      locked: false,
    });

    // 添加頁面文件名稱的文本元素
    excalidrawData.elements.push({
      type: 'text',
      version: 1,
      versionNonce: Math.floor(Math.random() * 100000),
      isDeleted: false,
      id: `${componentId}-page-${index}`,
      fillStyle: 'hachure',
      strokeWidth: 1,
      strokeStyle: 'solid',
      roughness: 1,
      opacity: 100,
      angle: 0,
      x: x + 225, // 調整文本位置
      y: pageYOffset + 5, // 調整文本位置
      strokeColor: '#000000',
      backgroundColor: 'transparent',
      width: boxWidth - 10, // 調整文本寬度
      height: 30,
      seed: Math.floor(Math.random() * 100000),
      groupIds: [],
      frameId: null,
      roundness: null,
      boundElements: [],
      updated: Date.now(),
      link: null,
      locked: false,
      fontSize: 14,
      fontFamily: 1,
      text: usage,
      textAlign: 'left',
      verticalAlign: 'top',
      containerId: null,
      originalText: usage,
      lineHeight: 1.875,
      baseline: 19,
    });

    pageYOffset += 40; // 調整位置以避免重疊
  });

  y += 200; // 調整 y 座標，防止重疊
});

// 將 Excalidraw JSON 文件保存到項目目錄
fs.writeFileSync(
  path.join(process.cwd(), 'tools/component-usage/component-usage.excalidraw.json'),
  JSON.stringify(excalidrawData, null, 2),
  'utf8',
);
console.log('Excalidraw JSON file created: component-usage.excalidraw.json');

/**
 * ======================
 * Markdown
 * ======================
 */
// 創建 Markdown 數據
let markdownData = '# Component Usage\n\n';

// 遍歷每個組件
Object.keys(componentUsage).forEach((component) => {
  markdownData += `## ${component}\n`;

  if (componentUsage[component].length > 0) {
    markdownData += `- Used in:\n`;
    componentUsage[component].forEach((usage) => {
      markdownData += `  - [${usage}](./${usage})\n`;
    });
  } else {
    markdownData += '- Not used in any pages\n';
  }

  markdownData += '\n'; // 分隔不同組件的段落
});

// 將 Markdown 文件保存到項目目錄
fs.writeFileSync(
  path.join(process.cwd(), 'tools/component-usage/component-usage.md'),
  markdownData,
  'utf8',
);
console.log('Markdown file created: component-usage.md');
