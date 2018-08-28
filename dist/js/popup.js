"use strict";

// TODO: Set dateTime value to today tomorrow?
// TODO: Random placeholders for labels
// TODO: Edit events

// User input
var idIncrementor = 0;

var validatedTitleInput = new ValidatedInput("titleInput", "validation");
var validatedDateTimeInput = new ValidatedInput("dateTimeInput", "validation");

// All events
var events = [];
var eventsContainer = document.querySelector("#eventsContainer");

var hue = 13; // x/360   13, 250, 173/82
var sat = 90; // x/100

var colorOptions = [{
  hue: 13,
  sat: 90
}, {
  hue: 173,
  sat: 82
}, {
  hue: 249,
  sat: 32
}, {
  hue: 353,
  sat: 83
}];

// #F46038
// #2F294F
// #1B998B
// #E71D35
// #E8D44D


main();

function main() {

  pullAllEvents(function () {
    setGradients();
    handleNoEventsMessage();

    validatedDateTimeInput.input.value = moment().format("YYYY-MM-DDTHH:mm");
  });

  // Event Listeners
  document.querySelector("#submitEventButton").addEventListener("click", function () {
    if (validatedDateTimeInput.validate() && validatedTitleInput.validate()) {
      pushEvent();
      document.querySelector("#addEventContainer").classList.remove("show");
      document.querySelector("#addEventForm").classList.remove("show");
      document.querySelector("#submitEventContainer").classList.remove("show");
    }
  });

  document.querySelector("#addEventButton").addEventListener("click", function () {
    document.querySelector("#addEventContainer").classList.add("show");
    document.querySelector("#addEventForm").classList.add("show");
    document.querySelector("#submitEventContainer").classList.add("show");
  });
}

function handleNoEventsMessage() {
  if (events == undefined || events.length < 1) {
    document.querySelector("#noEventsAlert").classList.add("true");
  } else {
    document.querySelector("#noEventsAlert").classList.remove("true");
  }
}

function pushEvent() {
  // Create an event and push it to the global array
  var event = {
    id: idIncrementor,
    titleInput: validatedTitleInput.value,
    dateTime: validatedDateTimeInput.value
  };

  events.push(event);
  addToEventsContainer(event);

  // Store in chrome sync
  chrome.storage.sync.set({ "events": events }, function () {
    print("Success! Events pushed");
    print(">", events);
  });

  // Increment ID
  idIncrementor += 1;

  handleNoEventsMessage();
  validatedTitleInput.value = "";
  validatedTitleInput.input.value = "";
}

function pullAllEvents(cb) {
  chrome.storage.sync.get(["events"], function (result) {
    print("Success! All events pulled");
    // print(">", result.events)

    events = result.events;
    if (result.events !== undefined) {
      result.events.forEach(function (event) {
        addToEventsContainer(event);
      });

      // Deal with id being undefined for whatever reason
      if (result.events[result.events.length - 1].id != undefined) {
        idIncrementor = result.events[result.events.length - 1].id + 1;
      } else {
        print("Error: ID of last item is undefined");
      }
    } else {
      events = [];
    }
    // }


    // Callback functions to call when events have been pulled
    cb();
  });

  return events;
}

function removeEvent(id) {

  // Remove from DOM
  var element = document.querySelector("div[data-eventId=\"" + id + "\"]");
  element.remove();

  // Remove from storage
  events = events.filter(function (element) {
    return element.id !== parseInt(id);
  });

  // Store in chrome sync
  chrome.storage.sync.set({ "events": events }, function () {
    print("Success! Events pushed");
    print(">", events);
  });

  handleNoEventsMessage();
  setGradients();
}

function addToEventsContainer(obj) {

  // TODO:  append to single fragment:
  // const fragment = document.createDocumentFragment() 

  var eventContainer = document.createElement("div");
  eventContainer.classList.add("eventContainer");
  eventContainer.setAttribute("data-eventId", String(obj.id));

  // Setup each element
  var titleElement = document.createElement("h2");
  var dateTimeRelativeElement = document.createElement("h1");
  var dateTimeElement = document.createElement("h3");

  titleElement.appendChild(document.createTextNode(obj.titleInput));
  dateTimeElement.appendChild(document.createTextNode(moment(obj.dateTime).format("Do MMMM YYYY, h:mma")));
  dateTimeRelativeElement.appendChild(document.createTextNode(moment(obj.dateTime).fromNow()));

  var removeElement = document.createElement("sub");
  removeElement.appendChild(document.createTextNode("x"));
  removeElement.classList.add("removeButton");

  eventContainer.appendChild(titleElement);
  eventContainer.appendChild(dateTimeRelativeElement);
  eventContainer.appendChild(dateTimeElement);
  eventContainer.appendChild(removeElement);

  removeElement.addEventListener("click", function (event) {
    removeEvent(event.target.parentElement.getAttribute("data-eventId"));
  });

  eventsContainer.appendChild(eventContainer);

  setGradients();
}

function setGradients() {

  var all = document.querySelectorAll(".eventContainer");
  var x = 100 / (all.length + 1);

  // say 4
  // then 25
  var index = 0;

  for (var i = 100 - x; i > 0; i -= x) {
    var element = all[index];

    // set element backgroundColor
    element.style.backgroundColor = "hsl(" + hue + ", " + sat + "%, " + i + "%)";

    if (i <= 50) {
      element.style.color = "white";
    } else {
      element.style.color = "black";
    }

    // Next element
    index++;
  }
}