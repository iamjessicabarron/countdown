// TODO: Set dateTime value to today tomorrow?
// TODO: Random placeholders for labels
// TODO: Edit events

// User input
let idIncrementor = 0
    
let validatedTitleInput = new ValidatedInput("titleInput", "validation")
let validatedDateTimeInput = new ValidatedInput("dateTimeInput", "validation")

// All events
let events = []
let eventsContainer = document.querySelector("#eventsContainer")

main() 

function main() {

  pullAllEvents(function() {
    setGradients()
    handleNoEventsMessage()

    validatedDateTimeInput.input.value = moment().format("YYYY-MM-DDTHH:mm")
  })

  // Event Listeners
  document.querySelector("#submitEventButton").addEventListener("click", function() {
    if (validatedDateTimeInput.validate() && validatedDateTimeInput.validate()) { 
      pushEvent()
      document.querySelector("#addEventContainer").classList.remove("show")
      document.querySelector("#addEventForm").classList.remove("show")
      document.querySelector("#submitEventContainer").classList.remove("show")
    } 
  })

  document.querySelector("#addEventButton").addEventListener("click", function() {
    document.querySelector("#addEventContainer").classList.add("show")
    document.querySelector("#addEventForm").classList.add("show")
    document.querySelector("#submitEventContainer").classList.add("show")
  })
  
}

function handleNoEventsMessage() {
  if (events.length < 1) {
    document.querySelector("#noEventsAlert").classList.add("true")
  } else {
    document.querySelector("#noEventsAlert").classList.remove("true")
  }
}

function pushEvent() {
  // Create an event and push it to the global array
    let event = {
      id: idIncrementor,
      titleInput: validatedTitleInput.value,
      dateTime: validatedDateTimeInput.value
    }
  
    events.push(event)
    addToEventsContainer(event)
  
    // Store in chrome sync
    chrome.storage.sync.set({"events": events}, function() {
      console.log("Success! Events pushed")
      console.log(">", events)
    });
  
    // Increment ID
    idIncrementor+=1
  
    handleNoEventsMessage()
  
}

function pullAllEvents(cb) {
  chrome.storage.sync.get(["events"], function(result) {
    console.log("Success! All events pulled")
    // console.log(">", result.events)

    events = result.events

//
    // Deal with an empty array
    // if (result.events != undefined) {
      print("result.events is defined")
      if (result.events !== undefined) {
        console.log("results.events is defined", result.events)
        console.log(">>", result.events)

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
    // }


    // Callback functions to call when events have been pulled
    cb()
  });
 
  return events
}

function removeEvent(id) {

  // Remove from DOM
  let element = document.querySelector(`div[data-eventId="${id}"]`)
  element.remove()

  // Remove from storage
  events = events.filter(function(element) {
    return element.id !== parseInt(id)
  })

    // Store in chrome sync
    chrome.storage.sync.set({"events": events}, function() {
      console.log("Success! Events pushed")
      console.log(">", events)
    });

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

  titleElement.appendChild(document.createTextNode(obj.titleInput))
  dateTimeElement.appendChild(document.createTextNode(moment(obj.dateTime).format("Do MMMM YYYY, h:mma")))
  dateTimeRelativeElement.appendChild(document.createTextNode(moment(obj.dateTime).fromNow()))

  let removeElement = document.createElement("sub")
  removeElement.appendChild(document.createTextNode("remove"))

  eventContainer.appendChild(titleElement)
  eventContainer.appendChild(dateTimeRelativeElement)
  eventContainer.appendChild(dateTimeElement)
  eventContainer.appendChild(removeElement)
  // Remove button

  removeElement.addEventListener("click", function(event) {
    removeEvent(event.target.parentElement.getAttribute("data-eventId"))
  })

  eventsContainer.appendChild(eventContainer)

  setGradients()
}

function setGradients() {

  let all = document.querySelectorAll(".eventContainer")
  let x = 100 / (all.length+1)

  // say 4
  // then 25
  let index = 0

  for (let i = 100-x; i > 0; i-=x) {
    let element = all[index]

    // set element backgroundColor
    element.style.backgroundColor = `hsl(0, 0%, ${i}%)`

    if (i <= 50) {
      element.style.color = "white"
    } else {
      element.style.color = "black"
    }
    
    // Next element
    index++
  }


}







