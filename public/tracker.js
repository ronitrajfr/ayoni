(function () {
  const script = document.currentScript;
  const websiteId = script?.getAttribute("data-website-id");

  if (!websiteId) return;
  let deviceType = "desktop";
  const width = window.innerWidth;

  if (width <= 767) {
    deviceType = "mobile";
  } else if (width <= 1024) {
    deviceType = "tablet";
  }

  const payload = {
    websiteId,
    url: location.href,
    referrer: document.referrer,
    browser: navigator.userAgent,
    os: navigator.platform,
    deviceType,
  };
  // console.log(payload);
  // console.log(websiteId);

  navigator.sendBeacon(
    "https://ayoni.vercel.app/api/collect",
    JSON.stringify(payload),
  );
})();
