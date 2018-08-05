// TODO: Set dateTime value to today tomorrow?
// TODO: Random placeholders for labels
// TODO: Edit events
// TODO: No events alert shows up when clicking on the thing again


let idIncrementor = 0
let events = []
let eventsContainer = document.querySelector("#eventsContainer")

main() 

// Functions

function main() {
  pullAllEvents()

  // Event Listeners
  document.querySelector("#submitEventButton").addEventListener('click', function() {
    pushEvent()
    document.querySelector("#addEventContainer").classList.remove("show")
    document.querySelector("#addEventForm").classList.remove("show")
    document.querySelector("#submitEventContainer").classList.remove("show")
  })

  document.querySelector("#addEventButton").addEventListener('click', function() {
    document.querySelector("#addEventContainer").classList.add("show")
    document.querySelector("#addEventForm").classList.add("show")
    document.querySelector("#submitEventContainer").classList.add("show")
  })

  // dateTime.value = moment().format('YYYY-MM-DDTHH:mm') // TODO: Make this actually work
}

function handleNoEventsMessage() {
  console.log("handling no events!")
  if (events.length < 1) {
    document.querySelector("#noEventsAlert").classList.add("true")
  } else {
    console.log("There's events here!")
    document.querySelector("#noEventsAlert").classList.remove("true")
  }
}

function pushEvent() {
  // User input
  let dateTime = document.querySelector("#dateTimeInput").value
  let title = document.querySelector("#titleInput").value

  // Create an event and push it to the global array
  let event = {
    id: idIncrementor,
    title: title,
    dateTime: dateTime
  }

  events.push(event)
  addToEventsContainer(event)

  // Store in chrome sync
  chrome.storage.sync.set({'events': events}, function() {
    console.log("Success! Events pushed")
    console.log(">", events)
  });

  // Increment ID
  idIncrementor+=1

  handleNoEventsMessage()
}

function pullAllEvents() {
  chrome.storage.sync.get(['events'], function(result) {
    console.log("Success! All events pulled")
    console.log(">", result.events)

    events = result.events

    // Deal with an empty array
    if (result.events.length > 0) {
      result.events.forEach(event => {
        addToEventsContainer(event)
      });

      // Deal with id being undefined for whatever reason
      if (result.events[result.events.length-1].id != undefined) {
        idIncrementor = result.events[result.events.length-1].id+1
      } else {
        console.log("Error: ID of last item is undefined")
      }
    }
  });

  handleNoEventsMessage() 
}

function removeEvent(id) {

  console.log("before", events)
  // Remove from DOM
  let element = document.querySelector(`div[data-eventId="${id}"]`)
  element.remove()

  // Remove from storage
  events = events.filter(function(element) {
    return element.id !== parseInt(id)
  })

    // Store in chrome sync
    chrome.storage.sync.set({'events': events}, function() {
      console.log("Success! Events pushed")
      console.log(">", events)
    });

  console.log("Successfully removed event", element)

  handleNoEventsMessage()
}

function addToEventsContainer(obj) {

  // TODO:  append to single fragment:
  // const fragment = document.createDocumentFragment() 

  let eventContainer = document.createElement("div")
  eventContainer.classList.add("eventContainer")
  eventContainer.setAttribute("data-eventId", String(obj.id))

  // Setup each element
  let titleElement = document.createElement("h2")
  let dateTimeRelativeElement = document.createElement("h1")
  let dateTimeElement = document.createElement("h3")

  titleElement.appendChild(document.createTextNode(obj.title))
  dateTimeElement.appendChild(document.createTextNode(moment(obj.dateTime).format('Do MMMM YYYY, h:mma')))
  dateTimeRelativeElement.appendChild(document.createTextNode(moment(obj.dateTime).fromNow()))

  let removeElement = document.createElement("sub")
  removeElement.appendChild(document.createTextNode("remove"))

  eventContainer.appendChild(titleElement)
  eventContainer.appendChild(dateTimeRelativeElement)
  eventContainer.appendChild(dateTimeElement)
  eventContainer.appendChild(removeElement)
  // Remove button



  removeElement.addEventListener('click', function(event) {
    removeEvent(event.target.parentElement.getAttribute("data-eventId"))
  })

  eventsContainer.appendChild(eventContainer)
}







