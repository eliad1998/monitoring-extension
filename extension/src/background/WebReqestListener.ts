declare const browser: typeof chrome | undefined;

const browserApi = (typeof chrome !== 'undefined' && chrome.runtime)
  ? chrome
  : (typeof browser !== 'undefined' ? browser : undefined);

if (!browserApi || !browserApi.webRequest) {
  console.error("Web Request API not found! Ensure script runs in Background context and permissions are set.");
}

else {
  browserApi.webRequest.onCompleted.addListener(
    (details) => {
      console.log("HTTP request detected:", details.url);
    },
    { urls: ["*://*.facebook.com/*"] }
  );
}