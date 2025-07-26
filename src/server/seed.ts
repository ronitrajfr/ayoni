// ! This is a seed file for the database

import { db } from "./db";

// Fake data generators
const fakeUrls = [
  "/",
  "/about",
  "/contact",
  "/blog",
  "/products",
  "/services",
  "/pricing",
  "/docs",
  "/api",
  "/login",
  "/signup",
  "/dashboard",
  "/profile",
  "/settings",
  "/help",
];

const fakeReferrers = [
  "https://google.com",
  "https://github.com",
  "https://twitter.com",
  "https://linkedin.com",
  "https://reddit.com",
  "https://facebook.com",
  "https://stackoverflow.com",
  "https://dev.to",
  null, // direct traffic
];

const fakeBrowsers = [
  "Chrome 119.0.0.0",
  "Firefox 120.0.0.0",
  "Safari 17.1.2",
  "Edge 119.0.0.0",
  "Opera 105.0.0.0",
];

const fakeOS = [
  "macOS",
  "Windows 11",
  "Windows 10",
  "Ubuntu",
  "iOS",
  "Android",
];

const fakeCountries = [
  "US",
  "CA",
  "GB",
  "DE",
  "FR",
  "JP",
  "AU",
  "BR",
  "IN",
  "NL",
  "IT",
  "ES",
  "RU",
  "CN",
  "KR",
  "SE",
  "NO",
  "FI",
  "DK",
  "PL",
  "TR",
  "MX",
  "ZA",
  "AR",
  "CH",
  "BE",
  "AT",
  "IE",
  "NZ",
  "SG",
  "ID",
  "TH",
  "MY",
  "PH",
  "EG",
  "SA",
  "AE",
  "IL",
  "GR",
  "PT",
  "HU",
  "CZ",
  "SK",
  "RO",
  "BG",
  "UA",
  "VN",
  "PK",
  "BD",
  "NG",
];

const countryNames: Record<string, string> = {
  US: "United States",
  CA: "Canada",
  GB: "United Kingdom",
  DE: "Germany",
  FR: "France",
  JP: "Japan",
  AU: "Australia",
  BR: "Brazil",
  IN: "India",
  NL: "Netherlands",
  IT: "Italy",
  ES: "Spain",
  RU: "Russia",
  CN: "China",
  KR: "South Korea",
  SE: "Sweden",
  NO: "Norway",
  FI: "Finland",
  DK: "Denmark",
  PL: "Poland",
  TR: "Turkey",
  MX: "Mexico",
  ZA: "South Africa",
  AR: "Argentina",
  CH: "Switzerland",
  BE: "Belgium",
  AT: "Austria",
  IE: "Ireland",
  NZ: "New Zealand",
  SG: "Singapore",
  ID: "Indonesia",
  TH: "Thailand",
  MY: "Malaysia",
  PH: "Philippines",
  EG: "Egypt",
  SA: "Saudi Arabia",
  AE: "United Arab Emirates",
  IL: "Israel",
  GR: "Greece",
  PT: "Portugal",
  HU: "Hungary",
  CZ: "Czech Republic",
  SK: "Slovakia",
  RO: "Romania",
  BG: "Bulgaria",
  UA: "Ukraine",
  VN: "Vietnam",
  PK: "Pakistan",
  BD: "Bangladesh",
  NG: "Nigeria",
};

const fakePostTitles = [
  "Getting Started with React",
  "The Future of Web Development",
  "Building Scalable APIs",
  "TypeScript Best Practices",
  "Database Optimization Tips",
  "Modern CSS Techniques",
  "Security in Web Applications",
  "Performance Monitoring Guide",
  "Clean Code Principles",
  "Testing Strategies",
];

function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

function randomIP(): string {
  return `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
}

function randomDate(daysAgo: number): Date {
  const now = new Date();
  const pastDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  const randomTime =
    pastDate.getTime() + Math.random() * (now.getTime() - pastDate.getTime());
  return new Date(randomTime);
}

async function seedPageViews(websiteId: string, count: number = 1000) {
  console.log(`🌱 Seeding ${count} page views...`);

  const pageViews = [];
  for (let i = 0; i < count; i++) {
    const country = randomChoice(fakeCountries);
    pageViews.push({
      url: randomChoice(fakeUrls),
      referrer: randomChoice(fakeReferrers),
      ip: randomIP(),
      browser: randomChoice(fakeBrowsers),
      os: randomChoice(fakeOS),
      country,
      websiteId,
      createdAt: randomDate(30), // last 30 days
    });
    // Optionally log for realism:
    // console.log(`PageView: ${country} (${countryNames[country]})`);
  }

  await db.pageView.createMany({
    data: pageViews,
  });
}

async function seedUniqueVisitors(websiteId: string, count: number = 200) {
  console.log(`🌱 Seeding ${count} unique visitors...`);

  const visitors = [];
  const usedIPs = new Set<string>();

  for (let i = 0; i < count; i++) {
    let ip = randomIP();
    // Ensure unique IPs
    while (usedIPs.has(ip)) {
      ip = randomIP();
    }
    usedIPs.add(ip);
    const country = randomChoice(fakeCountries);
    visitors.push({
      url: randomChoice(fakeUrls),
      referrer: randomChoice(fakeReferrers),
      ip,
      browser: randomChoice(fakeBrowsers),
      os: randomChoice(fakeOS),
      country,
      websiteId,
      createdAt: randomDate(30), // last 30 days
    });
    // Optionally log for realism:
    // console.log(`Visitor: ${country} (${countryNames[country]})`);
  }

  await db.uniqueVisitorLog.createMany({
    data: visitors,
  });
}

async function seedPosts(userId: string, count: number = 10) {
  console.log(`🌱 Seeding ${count} posts...`);

  const posts = [];
  for (let i = 0; i < count; i++) {
    posts.push({
      name: randomChoice(fakePostTitles),
      createdById: userId,
      createdAt: randomDate(60), // last 60 days
    });
  }

  await db.post.createMany({
    data: posts,
  });
}

async function ensureUserExists(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    console.log(`📝 Creating user with ID: ${userId}`);
    await db.user.create({
      data: {
        id: userId,
        name: "Seed User",
        email: `user-${userId}@example.com`,
      },
    });
  } else {
    console.log(`✅ User ${userId} already exists`);
  }
}

async function ensureWebsiteExists(websiteId: string, userId: string) {
  const website = await db.website.findUnique({
    where: { id: websiteId },
  });

  if (!website) {
    console.log(`📝 Creating website with ID: ${websiteId}`);
    await db.website.create({
      data: {
        id: websiteId,
        name: "Seed Website",
        domain: `example-${websiteId.slice(0, 8)}.com`,
        userId,
      },
    });
  } else {
    console.log(`✅ Website ${websiteId} already exists`);
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log(
      "❌ Usage: bun run src/server/seed.ts <userId> <websiteId> [pageViews] [uniqueVisitors] [posts]",
    );
    console.log(
      "📝 Example: bun run src/server/seed.ts user123 website456 1000 200 10",
    );
    process.exit(1);
  }

  const [
    userId,
    websiteId,
    pageViewsCount = "1000",
    uniqueVisitorsCount = "200",
    postsCount = "10",
  ] = args;

  if (!userId || !websiteId) {
    console.log("❌ userId and websiteId are required");
    process.exit(1);
  }

  console.log("🚀 Starting seed process...");
  console.log(`👤 User ID: ${userId}`);
  console.log(`🌐 Website ID: ${websiteId}`);
  console.log(`📊 Page Views: ${pageViewsCount}`);
  console.log(`👥 Unique Visitors: ${uniqueVisitorsCount}`);
  console.log(`📝 Posts: ${postsCount}`);
  console.log("");

  try {
    // Ensure user and website exist
    await ensureUserExists(userId);
    await ensureWebsiteExists(websiteId, userId);

    // Seed data
    await seedPageViews(websiteId, parseInt(pageViewsCount));
    await seedUniqueVisitors(websiteId, parseInt(uniqueVisitorsCount));
    await seedPosts(userId, parseInt(postsCount));

    console.log("");
    console.log("✅ Seeding completed successfully!");

    // Show summary
    const totalPageViews = await db.pageView.count({ where: { websiteId } });
    const totalUniqueVisitors = await db.uniqueVisitorLog.count({
      where: { websiteId },
    });
    const totalPosts = await db.post.count({ where: { createdById: userId } });

    console.log(`📊 Total page views for website: ${totalPageViews}`);
    console.log(`👥 Total unique visitors for website: ${totalUniqueVisitors}`);
    console.log(`📝 Total posts for user: ${totalPosts}`);
  } catch (error) {
    console.error("❌ Error during seeding:", error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

main().catch((error) => {
  console.error("❌ Fatal error:", error);
  process.exit(1);
});
