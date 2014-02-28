function makeListWithArray(array) {
  var list = document.createElement('ul');
  list.id = 'results_list';

  for (var i = 0; i < array.length; i++) {
    var item = document.createElement('li');
    item.className = 'result';
    item.appendChild(document.createTextNode(array[i]));
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

    var titles = [];
    for (var i = 0; i < tabs.length; i++) {
      titles[i] = tabs[i].title;
    }
    resultsSection.appendChild(makeListWithArray(titles));
    resultsList = resultsSection.lastChild;
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
