export { }
import { getToken, saveToken, type IAuthToken } from "./storage";


declare const browser: typeof chrome | undefined

console.log("Background script running");


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

/**
 * Authentication:
 * First time username+password,
 * Then api key, 
 * Second time fingerprint
 * Then jwt
 * Mix it all together
 * Also I need somehow to make fastapi ssl
 * After authentication, receiving the regex for listening
 * Should the user login?
 */