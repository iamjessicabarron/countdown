

let idIncrementor = 0
let events = []
let eventsContainer = document.querySelector("#eventsContainer")

main() 

// Functions

function main() {
  pullAllEvents()

  // Event Listeners
  document.querySelector("#submitEvent").addEventListener('click', function() {
    pushEvent()
  })

  // dateTime.value = moment().format('YYYY-MM-DDTHH:mm') // TODO: Make this actually work
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

  console.log("after", events)
  console.log("Successfully removed event", element)
}

function addToEventsContainer(obj) {

  // TODO:  append to single fragment:
  // const fragment = document.createDocumentFragment() 

  let eventContainer = document.createElement("div")
  eventContainer.id = "eventContainer"
  eventContainer.setAttribute("data-eventId", String(obj.id))

  // Setup each element
  let titleElement = document.createElement("p")
  let dateTimeElement = document.createElement("p")

  titleElement.appendChild(document.createTextNode(obj.title))
  dateTimeElement.appendChild(document.createTextNode(moment(obj.dateTime).fromNow()))

  eventContainer.appendChild(titleElement)
  eventContainer.appendChild(dateTimeElement)

  // Remove button
  let removeElement = document.createElement("sub")
  removeElement.appendChild(document.createTextNode("remove"))
  eventContainer.appendChild(removeElement)

  removeElement.addEventListener('click', function(event) {
    removeEvent(event.target.parentElement.getAttribute("data-eventId"))
  })

  eventsContainer.appendChild(eventContainer)
}







