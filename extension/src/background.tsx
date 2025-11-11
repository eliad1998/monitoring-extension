export {}
 
console.log(
  "Live now; make now always the most precious time. Now will never come again."
)
chrome.runtime.onInstalled.addListener(() => {
  console.log("Background worker loaded!")
});
