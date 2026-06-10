async function updateBadge(tabId, changeInfo) {
  const groups = await chrome.tabGroups.query({ title: "Distractors" });
  const groupIds = new Set(groups.map(g => g.id));

  const distractorTabs = await chrome.tabs.query({
    url: [
      "*://*.youtube.com/*",
      "*://*.instagram.com/*",
      "*://*.reddit.com/*",
    ]
  });

  const ungroupedDistractors = distractorTabs.filter(t => !groupIds.has(t.groupId));

  if (ungroupedDistractors.length) {
    await chrome.action.setBadgeText({ text: "!" });
    await chrome.action.setBadgeBackgroundColor({ color: "#ef4444" });
  } else if (groups.length) {
    await chrome.action.setBadgeText({ text: " " });
    await chrome.action.setBadgeBackgroundColor({ color: "#22c55e" });
  } else {
    await chrome.action.setBadgeText({ text: "" });
  }

  
  if(distractorTabs.some(tab => tab.id == tabId) && changeInfo.url) {
    const time = Date.now();
    await chrome.storage.local.set({ [String(tabId)]: time })
    await console.log(time);
  }
}

function handleMsgs(message, sender, sendResponse) {
  if (message.action == 'get-time-yo') {
    console.log(sender.tab.id);
    chrome.storage.local.get([String(sender.tab.id)], function(result) {
      chrome.tabs.get(sender.tab.id, function(tab) {
        sendResponse({ data: result, title: tab.title });
      });
    });
    return true;
  }
}

chrome.runtime.onMessage.addListener(handleMsgs);

chrome.tabs.onCreated.addListener(updateBadge);
chrome.tabs.onUpdated.addListener(updateBadge);
chrome.tabs.onRemoved.addListener(updateBadge);
