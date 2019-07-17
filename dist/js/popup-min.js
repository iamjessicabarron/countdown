"use strict";var idIncrementor=0,validatedTitleInput=new ValidatedInput("titleInput","validation"),validatedDateTimeInput=new ValidatedInput("dateTimeInput","validation"),events=[],eventsContainer=document.querySelector("#eventsContainer"),hue=13,sat=90,colorOptions=[{hue:13,sat:90},{hue:173,sat:82},{hue:249,sat:32},{hue:353,sat:83}];function main(){pullAllEvents(function(){setGradients(),handleNoEventsMessage(),validatedDateTimeInput.input.value=moment().format("YYYY-MM-DDTHH:mm")}),document.querySelector("#submitEventButton").addEventListener("click",function(){print("submit event button"),validatedDateTimeInput.validate()&&validatedTitleInput.validate()&&(pushEvent(),document.querySelector("#addEventContainer").classList.remove("show"),document.querySelector("#addEventForm").classList.remove("show"),document.querySelector("#submitEventContainer").classList.remove("show"))}),document.querySelector("#addEventButton").addEventListener("click",function(){document.querySelector("#addEventContainer").classList.add("show"),document.querySelector("#addEventForm").classList.add("show"),document.querySelector("#submitEventContainer").classList.add("show")})}function handleNoEventsMessage(){null==events||events.length<1?document.querySelector("#noEventsAlert").classList.add("true"):document.querySelector("#noEventsAlert").classList.remove("true")}function pushEvent(){var e={id:idIncrementor,titleInput:validatedTitleInput.value,dateTime:validatedDateTimeInput.value};events.push(e),addToEventsContainer(e),chrome.storage.sync.set({events:events},function(){print("Success! Events pushed"),print(">",events)}),idIncrementor+=1,handleNoEventsMessage(),validatedTitleInput.value="",validatedTitleInput.input.value=""}function pullAllEvents(e){return chrome.storage.sync.get(["events"],function(t){print("Success! All events pulled"),events=t.events,void 0!==t.events?(t.events.forEach(function(e){addToEventsContainer(e)}),null!=t.events[t.events.length-1].id?idIncrementor=t.events[t.events.length-1].id+1:print("Error: ID of last item is undefined")):events=[],e()}),events}function removeEvent(e){document.querySelector('div[data-eventId="'+e+'"]').remove(),events=events.filter(function(t){return t.id!==parseInt(e)}),chrome.storage.sync.set({events:events},function(){print("Success! Events pushed"),print(">",events)}),handleNoEventsMessage(),setGradients()}function addToEventsContainer(e){var t=document.createElement("div");t.classList.add("eventContainer"),t.setAttribute("data-eventId",String(e.id));var n=document.createElement("h2"),a=document.createElement("h1"),d=document.createElement("h3");n.appendChild(document.createTextNode(e.titleInput)),d.appendChild(document.createTextNode(moment(e.dateTime).format("Do MMMM YYYY, h:mma"))),a.appendChild(document.createTextNode(moment(e.dateTime).fromNow()));var s=document.createElement("sub");s.appendChild(document.createTextNode("x")),s.classList.add("removeButton"),t.appendChild(n),t.appendChild(a),t.appendChild(d),t.appendChild(s),s.addEventListener("click",function(e){removeEvent(e.target.parentElement.getAttribute("data-eventId"))}),eventsContainer.appendChild(t),setGradients()}function setGradients(){for(var e=document.querySelectorAll(".eventContainer"),t=100/(e.length+1),n=0,a=100-t;a>0;a-=t){var d=e[n];d.style.backgroundColor="hsl("+hue+", "+sat+"%, "+a+"%)",d.style.color=a<=50?"white":"black",n++}}main();