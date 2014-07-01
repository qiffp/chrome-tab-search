function makeTabListWithArray(tabs, activeTabId) {
  var list = document.createElement('ul');
  list.id = 'results_list';

  for (var i = 0; i < tabs.length; i++) {
    var item = document.createElement('li');
    item.className = 'result';

    if (tabs[i].favIconUrl) {
      var favicon = document.createElement('img');
      favicon.setAttribute('src', tabs[i].favIconUrl);
      item.appendChild(favicon);
    } else {
      var padding = document.createElement('div');
      padding.setAttribute('class', 'empty-favicon-padding');
      item.appendChild(padding);
    }

    if (tabs[i].id === activeTabId) {
      var boldElement = document.createElement('b');
      boldElement.appendChild(document.createTextNode(tabs[i].title));
      item.appendChild(boldElement);
    } else {
      item.appendChild(document.createTextNode(tabs[i].title));
    }

    list.appendChild(item);
  }

  return list;
}

document.addEventListener('DOMContentLoaded', function() {
  var searchbar = document.getElementById('query');
  var resultsSection = document.getElementById('results_section');
  var resultsList;
  var tabs = [];

  chrome.windows.getAll({populate: true}, function(windows) {
    tabs = windows.reduce(function(previous, current) {
      return previous.concat(current.tabs);
    }, []);

    var activeTabId;
    var activeTabIndex;
    chrome.tabs.query({active: true, currentWindow: true}, function(activeTabs) {
      activeTabId = activeTabs[0].id;
      resultsSection.appendChild(makeTabListWithArray(tabs, activeTabId));
      resultsList = resultsSection.lastChild;
    });
  });

  resultsSection.addEventListener('mouseup', function(e) {
    if (e.target && e.target.className === 'result') {
      var clickIndex = Array.prototype.indexOf.call(resultsList.childNodes, e.target);
      var tabId = tabs[clickIndex].id;
      var tabWindowId = tabs[clickIndex].windowId;
      chrome.windows.getCurrent(function(window) {
        if (window.id !== tabWindowId) {
          chrome.windows.update(tabWindowId, {focused: true});
        }
      });
      chrome.tabs.update(tabId, {active: true});
    }
  });
});
