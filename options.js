$(function () {
  chrome.storage.sync.get("limit", function (budget) {
    $("#limit").val(
      budget.limit
    ); /* When we open options page by right click on our extension then it will moves 
    to next tab and show our set existing limit so that is why we are getting the set limit value from google storage */
  });
  $("#saveLimit").click(function () {
    var limit = $("#limit").val();
    if (limit) {
      chrome.storage.sync.set({ limit: limit }, function () {
        // 'limit' is object and 'limit': limit is getting the value of the variable which we declared in the line no.3
        close();
      });
    }
  });
  $("#resetTotal").click(function () {
    chrome.storage.sync.set({ total: 0 }, function () {
      //This callback function for notify the user when the total reset to the zero

      var notifOptions = {
        type: "basic",
        iconUrl: "icon48.png",
        title: "Total reset!",
        message: "Total has been reset to 0!",
      };
      chrome.notifications.create("limitNotif", notifOptions);
    });
  });
});
