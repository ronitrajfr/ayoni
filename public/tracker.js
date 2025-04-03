(function () {
  const script = document.currentScript;
  const websiteId = script?.getAttribute("data-website-id");

  if (!websiteId) return;

  const payload = {
    websiteId,
    url: location.href,
    referrer: document.referrer,
    browser: navigator.userAgent,
    os: navigator.platform,
  };
  console.log(payload);
  console.log(websiteId);

  navigator.sendBeacon(
    "http://localhost:3000/api/collect",
    JSON.stringify(payload),
  );
})();
