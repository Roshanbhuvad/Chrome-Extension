//We are going to be making use of jQuery to listen to the click event on the spend button
/* total is first parameter it takes is the variable value and this chrome storage for which we need to retrieve the value
so total is going to be a property & it expects a callback function as the second parameter
So all chrome API's are asynchronous in nature so we are going to have callback function */

$(function () {
  chrome.storage.sync.get(["total", "limit"], function (budget) {
    $("#total").text(budget.total); //we are going is anytime the user enter opens the pop up we're just making sure this total is already displayed
    $("#limit").text(budget.limit);
  });

  $("#spendAmount").click(function () {
    //We have our submit button  on  our pop-up hTML and the ID is #spendAmount when user click on this button, we first query to chrome storage to check if total already exists
    //If it does exists then we are adding it with new total otherwise it is going to remains zero
    chrome.storage.sync.get(["total", "limit"], function (budget) {
      // Budget is a object for callback function and total is first parameter
      var newTotal = 0;
      if (budget.total) {
        //So budget object budget.total this total is existing then we need to add to the new total
        newTotal += parseInt(budget.total); // We have to make as a integer using parseInt for conversion from string to integer
      }

      // So now for the user entered amount we are going to store in variable as amount
      //We are going to select the input box amount
      var amount = $("#amount").val(); // Whatever user has entered we are storing an amount
      if (amount) {
        newTotal += parseInt(amount);
      }
      //Now we have our new total in place we can set or send this below new total back to the chromo storage so we are create another chrome API
      chrome.storage.sync.set({ total: newTotal }, function () {
        if (amount && newTotal >= budget.limit) {
          //if new total is greater than or equal to the budge.limit then we needs to send a notification to the user
          //first need to create notification options object
          var notifOptions = {
            type: "basic", // this is the type of notification
            iconUrl: "icon48.png", // We are setting the icon along with the notification
            title: "Limit Exceeds",
            message: "Uh oh! Looks like you've reached your limit!",
          };
          //Now we use chrome API to create notification
          chrome.notifications.create("limitNotif", notifOptions); //in this syntax we are setting ID for the notification as name is "limitNotif" as a parameter and calling notifOptions object which we have declared above
        }
      }); //first one is a key or the variable name in the chrome storage
      // Once we have set the value we need to update our UI

      $("#total").text(newTotal); // this is going to update the new total on our pop-up HTML
      $("#amount").val(""); //finally we are going to clear out input box
    });
  });
});
