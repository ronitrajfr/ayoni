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
  // console.log(payload);
  // console.log(websiteId);

  navigator.sendBeacon(
    "https://ayoni.vercel.app/api/collect",
    JSON.stringify(payload),
  );
})();
