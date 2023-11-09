document.addEventListener('DOMContentLoaded', function () {
  const saveButton = document.getElementById('saveButton');
  const savedLinksList = document.getElementById('savedLinks');

  saveButton.addEventListener('click', function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const currentUrl = tabs[0].url;
      saveLink(currentUrl);
    });
  });

  // Function to save the link
  function saveLink(url) {
    // Get the saved links from storage
    chrome.storage.sync.get({ savedLinks: [] }, function (result) {
      const savedLinks = result.savedLinks;

      // Add the new link with the current date to the saved links array
      const currentDate = new Date().toLocaleDateString();
      savedLinks.push({ url: url, date: currentDate });

      // Save the updated array back to storage
      chrome.storage.sync.set({ savedLinks: savedLinks }, function () {
        // Clear the existing list
        savedLinksList.innerHTML = '';

        // Display the saved links with dates and remove option
        savedLinks.forEach(function (linkObj, index) {
          const listItem = createListItem(linkObj, index);
          savedLinksList.appendChild(listItem);
        });
      });
    });
  }

  // Function to remove a link
  function removeLink(index) {
    chrome.storage.sync.get({ savedLinks: [] }, function (result) {
      const savedLinks = result.savedLinks;

      // Remove the link at the specified index
      savedLinks.splice(index, 1);

      // Save the updated array back to storage
      chrome.storage.sync.set({ savedLinks: savedLinks }, function () {
        // Clear the existing list
        savedLinksList.innerHTML = '';

        // Display the remaining saved links with dates and remove option
        savedLinks.forEach(function (linkObj, newIndex) {
          const listItem = createListItem(linkObj, newIndex);
          savedLinksList.appendChild(listItem);
        });
      });
    });
  }

  // Function to create a list item with date, link, and remove option
  function createListItem(linkObj, index) {
    const listItem = document.createElement('li');
    listItem.innerHTML = `<strong>${linkObj.date}</strong>: ${linkObj.url} <span class="remove" data-index="${index}">Remove</span>`;

    // Add click event listener to remove link
    const removeButton = listItem.querySelector('.remove');
    removeButton.addEventListener('click', function () {
      const indexToRemove = parseInt(removeButton.dataset.index);
      removeLink(indexToRemove);
    });

    return listItem;
  }

  // Function to display saved links on popup open
  function displaySavedLinks() {
    chrome.storage.sync.get({ savedLinks: [] }, function (result) {
      const savedLinks = result.savedLinks;

      savedLinks.forEach(function (linkObj, index) {
        const listItem = createListItem(linkObj, index);
        savedLinksList.appendChild(listItem);
      });
    });
  }

  // Display saved links on popup open
  displaySavedLinks();
});
