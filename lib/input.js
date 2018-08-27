class ValidatedInput {
  constructor(inputId) {
    this.regex = new RegExp(/[|;$%@"<>()+,]/, "g");

    this.input = document.querySelector(`#${inputId}`) // Todo, set this up
    this.validationMessages = []
    this.validation = this.createValidationAlert()

    this.input.insertAdjacentElement("afterend", this.validation)

    this.addListener()
  }

  addListener() {
    let self = this
    this.input.addEventListener("keyup", function() {
      self.validate()
      self.updateValidationMessages() 
    })
  }

  // Add validation to popup.js

  validate() {
    let sanitisedInput = this.sanitise(this.input.value)
    // Sanitise
    if (this.input.value == undefined || this.input.value.length < 1) {
      this.addValidationMessage("This isn't a valid response: It's empty.")
      // this.input.nextElementSibling.classList.add("true")
      return false
    } else {
      this.validationMessages = []
      // this.input.nextElementSibling.classList.remove("true")
      return true
    }
  }

  sanitise(str) {
    if (str.length > 0) {
      return str.replace(this.regex);
    } else {
      return str
    } 
  }

  createValidationAlert() {
    let divElement = document.createElement("div")
    divElement.classList.add("validationAlert")

    return divElement
  }

  updateValidationMessages() {
    let self = this

    while (this.validation.lastChild) {
        this.validation.removeChild(this.validation.lastChild);
    }

    this.validationMessages.forEach(function(message) {
      let pElement = document.createElement("p")
      let textNode = document.createTextNode(message)
      pElement.appendChild(textNode)

      self.validation.appendChild(pElement)
    })
  }

    addValidationMessage(message) {
      if (!this.validationMessages.includes(message)) {
        this.validationMessages.push(message)
      }
    }


}
