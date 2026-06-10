const tabs = await chrome.tabs.query({
  url: [
    "*://*.youtube.com/*",
    "*://*.instagram.com/*",
    "*://*.reddit.com/*"
  ]
});

if (!tabs.length) {
  document.querySelector("ul").textContent = "No distractors open, great job!";
} else {
  const collator = new Intl.Collator();
  tabs.sort((a, b) => collator.compare(a.title, b.title));

  const template = document.getElementById("li_template");
  const elements = new Set();
  for (const tab of tabs) {
    const element = template.content.firstElementChild.cloneNode(true);
    const title = tab.title.split("-")[0].trim();
    const hostname = new URL(tab.url).hostname.replace("www.", "");
    element.querySelector(".title").textContent = title;
    element.querySelector(".pathname").textContent = hostname;
    element.querySelector("a").addEventListener("click", async () => {
      await chrome.tabs.update(tab.id, { active: true });
      await chrome.windows.update(tab.windowId, { focused: true });
    });
    elements.add(element);
  }
  document.querySelector("ul").append(...elements);
}

const button = document.querySelector("button");
button.addEventListener("click", async () => {
  const tabIds = tabs.map(({ id }) => id);
  if (tabIds.length) {
    const group = await chrome.tabs.group({ tabIds });
    await chrome.tabGroups.update(group, { title: "Distractors" });
  }
  const groups = await chrome.tabGroups.query({ title: "Distractors" });
  for (const group of groups) {
    await chrome.tabGroups.update(group.id, { collapsed: true });
  }
});

document.querySelector(".button-2").addEventListener("click", async () => {
  const groups = await chrome.tabGroups.query({ title: "Distractors" });
  const groupIds = new Set(groups.map(g => g.id));
  const tabs = await chrome.tabs.query({ currentWindow: true });
  const tabIds = tabs.filter(t => groupIds.has(t.groupId)).map(t => t.id);
  if (tabIds.length) {
    await chrome.tabs.ungroup(tabIds);
  }
});