/* this JS file to create a contextMenu for our extension which shows when we right 
clicking by mouse to add our expense in budget manager e.g like when we do online shopping 
so it should be add in our budget manager by using context Menu */

// First we are going to create context menu item

var contextMenuItem = {
  //this is object
  id: "spendMoney",
  title: "SpendMoney", // to specify a title and this is basically what appears when we right-click on the webpage
  contexts: ["selection"], //this context where this is supposed to appear We are going to have to make this appears only when the user select something on the webpage so context is the selection
};

chrome.contextMenus.create(contextMenuItem);

function isInt(value) {
  // This function check if the user selected the integer value or not, and return true, this is function application when we add our spending in budget manager
  return (
    !isNaN(value) &&
    parseInt(Number(value)) == value &&
    !isNaN(parseInt(value, 10))
  );
}
//We are creating another chrome API so what we basically do is listen to the clicked event on this context menu item
//We are basically listening to the click event on the context menu, this below code is going to take a callback function
chrome.contextMenus.onClicked.addListener(function (clickData) {
  //clickData is a object
  /* We are check if what the user clicked on is our menu item so clickData.menuItemId == spendMoney 
  and we also need to check that there is some selection text after all*/
  if (clickData.menuItemId == "spendMoney" && clickData.selectionText) {
    //So if user clicked on our menu item ID and he has selected something then we need to do something
    //First we need to check if the user has selected an integer value
    if (isInt(clickData.selectionText)) {
      chrome.storage.sync.get(["total", "limit"], function (budget) {
        //this will going to return an array first is total and second is limit and this is callback function has budget as a argument

        var newTotal = 0;
        // We are try to get(retrieve) the existing total and then we are going to add that total to the new total
        if (budget.total) {
          newTotal += parseInt(budget.total);
        }
        //then we can go ahead and add our selected text from webpage (like amazon,flipkart item price) to the new total
        newTotal += parseInt(clickData.selectionText);

        chrome.storage.sync.set({ total: newTotal }, function () {
          //We had the notification if it exceeds the limit so we are going to have callback function
          if (newTotal >= budget.limit) {
            var notifOptions = {
              type: "basic", // this is the type of notification
              iconUrl: "icon48.png", // We are setting the icon along with the notification
              title: "Limit Exceeds",
              message: "Uh oh! Looks like you've reached your limit!",
            };
            //Now we use chrome API to create notification
            chrome.notifications.create("limitNotif", notifOptions); //in this syntax we are setting ID for the notification as name is "limitNotif" as a parameter and calling notifOptions object which we have declared above
          }
        });
      });
    }
  }
});

chrome.storage.onChanged.addListener(function (changes, storageName) {
  chrome.browserAction.setBadgeText({
    text: changes.total.newValue.toString(),
  });
});
