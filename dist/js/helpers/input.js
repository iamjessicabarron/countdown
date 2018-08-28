"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* exported ValidatedInput for ESLint */
var ValidatedInput = function () {
  function ValidatedInput(inputId) {
    _classCallCheck(this, ValidatedInput);

    this.regex = new RegExp(/[|;$%@"<>()+,]/, "g");

    this.input = document.querySelector("#" + inputId);
    this.value = ""; // Sanitised Value

    this.validationMessages = [];
    this.validationContainer = this.createValidationAlert();
    this.input.insertAdjacentElement("afterend", this.validationContainer);

    this.addListener();
  }

  _createClass(ValidatedInput, [{
    key: "addListener",
    value: function addListener() {
      var self = this;
      this.input.addEventListener("keyup", function () {
        self.validate();
      });
    }

    // Validation Functions

  }, {
    key: "validate",
    value: function validate() {
      print("validating");
      this.value = this.sanitise(this.input.value); // TODO: Do I need this?

      if (this.input.value == undefined || this.input.value.length < 1) {
        // Some issues, add errors
        this.addValidationMessage("This isn't a valid response: It's empty.");

        // Update UI
        this.validationContainer.classList.add("true");
        this.updateValidationMessages();
        return false;
      } else if (this.value.length < 1) {
        // Some issues, add errors
        this.addValidationMessage("This isn't a valid response: Contains only invalid characters."); // TODO: Contains invalid character ''

        // Update UI
        this.validationContainer.classList.add("true");
        this.updateValidationMessages();
        return false;
      } else {
        print("returning true");
        // No issues, remove errors
        this.validationMessages = [];

        // Update UI
        this.validationContainer.classList.remove("true");
        this.updateValidationMessages();
        return true;
      }
    }
  }, {
    key: "addValidationMessage",
    value: function addValidationMessage(message) {
      if (!this.validationMessages.includes(message)) {
        this.validationMessages.push(message);
      }
    }
  }, {
    key: "sanitise",
    value: function sanitise(str) {
      if (str.length > 0) {
        return str.replace(this.regex, "");
      } else {
        return str;
      }
    }

    // UI Functions

  }, {
    key: "createValidationAlert",
    value: function createValidationAlert() {
      var divElement = document.createElement("div");
      divElement.classList.add("validationAlert");

      return divElement;
    }
  }, {
    key: "updateValidationMessages",
    value: function updateValidationMessages() {
      var self = this;

      while (this.validationContainer.lastChild) {
        this.validationContainer.removeChild(this.validationContainer.lastChild);
      }

      this.validationMessages.forEach(function (message) {
        var pElement = document.createElement("p");
        var textNode = document.createTextNode(message);
        pElement.appendChild(textNode);

        self.validationContainer.appendChild(pElement);
      });
    }
  }]);

  return ValidatedInput;
}();