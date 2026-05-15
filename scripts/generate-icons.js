const sharp = require("sharp");
const path = require("path");

const publicDir = path.join(__dirname, "../public");

// Create a pink background 192x192 icon with "CC" text
const createIcon192 = async () => {
  const svgImage = `
    <svg width="192" height="192" xmlns="http://www.w3.org/2000/svg">
      <rect width="192" height="192" fill="#ec4899"/>
      <text x="96" y="110" fontSize="80" fontWeight="bold" textAnchor="middle" fill="white" fontFamily="Arial">CC</text>
    </svg>
  `;

  await sharp(Buffer.from(svgImage))
    .png()
    .toFile(path.join(publicDir, "icon-192.png"));

  console.log("✓ Created icon-192.png");
};

// Create a pink background 512x512 icon with "Chalak Champs" text
const createIcon512 = async () => {
  const svgImage = `
    <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" fill="#ec4899"/>
      <text x="256" y="280" fontSize="120" fontWeight="bold" textAnchor="middle" fill="white" fontFamily="Arial">CC</text>
    </svg>
  `;

  await sharp(Buffer.from(svgImage))
    .png()
    .toFile(path.join(publicDir, "icon-512.png"));

  console.log("✓ Created icon-512.png");
};

// Create screenshot images
const createScreenshots = async () => {
  // Mobile screenshot (540x720)
  const mobileSvg = `
    <svg width="540" height="720" xmlns="http://www.w3.org/2000/svg">
      <rect width="540" height="720" fill="#f5f5f5"/>
      <rect width="540" height="100" fill="#ec4899"/>
      <text x="270" y="60" fontSize="32" fontWeight="bold" textAnchor="middle" fill="white" fontFamily="Arial">Chalak Champs</text>
      <text x="270" y="400" fontSize="24" textAnchor="middle" fill="#333" fontFamily="Arial">Learn English with Fun</text>
    </svg>
  `;

  await sharp(Buffer.from(mobileSvg))
    .png()
    .toFile(path.join(publicDir, "screenshot-mobile.png"));

  console.log("✓ Created screenshot-mobile.png");

  // Desktop screenshot (1280x720)
  const desktopSvg = `
    <svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
      <rect width="1280" height="720" fill="#f5f5f5"/>
      <rect width="1280" height="80" fill="#ec4899"/>
      <text x="640" y="50" fontSize="36" fontWeight="bold" textAnchor="middle" fill="white" fontFamily="Arial">Chalak Champs - Learn English</text>
      <text x="640" y="360" fontSize="28" textAnchor="middle" fill="#333" fontFamily="Arial">Interactive English Learning Platform</text>
    </svg>
  `;

  await sharp(Buffer.from(desktopSvg))
    .png()
    .toFile(path.join(publicDir, "screenshot-desktop.png"));

  console.log("✓ Created screenshot-desktop.png");
};

(async () => {
  try {
    await createIcon192();
    await createIcon512();
    await createScreenshots();
    console.log("\n✅ All PWA assets generated successfully!");
  } catch (error) {
    console.error("❌ Error generating icons:", error);
    process.exit(1);
  }
})();
