console.log("Running!")

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({'events': []}, function() {
    console.log("Setup events storage")
  });
});

chrome.browserAction.onClicked.addListener(function(tab) {
  // No tabs or host permissions needed!
  console.log('I clicked it!', tab.url);
  // chrome.tabs.executeScript({
  //   code: 'document.body.style.backgroundColor="red"'
  // });
});











