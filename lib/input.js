class ValidatedInput {
  constructor(inputId) {
    this.regex = new RegExp(/[|;$%@"<>()+,]/, "g");

    this.input = document.querySelector(`#${inputId}`) // Todo, set this up
    this.validationMessages = []
    this.validation = this.createValidationAlert()

    this.input.insertAdjacentElement("afterend", this.validation)

    this.value = ""

    this.addListener()
  }

  addListener() {
    let self = this
    console.log("adding a listener")
    this.input.addEventListener("keyup", function() {
      self.validate()
    })
  }

  validate() {
    this.value = this.sanitise(this.input.value) // TODO: Do I need this?

    if (this.input.value == undefined || this.input.value.length < 1) {
      // Some issues, add errors
      this.addValidationMessage("This isn't a valid response: It's empty.")

      // Update UI
      this.validation.classList.add("true")
      this.updateValidationMessages() 
      return false

    } else if (this.value.length < 1) {
      // Some issues, add errors
      this.addValidationMessage("This isn't a valid response: Contains only invalid characters.") // TODO: Contains invalid character ''

      // Update UI
      this.validation.classList.add("true")
      this.updateValidationMessages() 
      return false
    } else {
      // No issues, remove errors
      this.validationMessages = []
      
      // Update UI
      this.validation.classList.remove("true")
      this.updateValidationMessages() 
      return true
    }
  }

  sanitise(str) {
    if (str.length > 0) {
      return str.replace(this.regex, "");
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
