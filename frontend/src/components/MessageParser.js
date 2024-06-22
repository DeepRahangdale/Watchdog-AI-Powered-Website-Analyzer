// src/components/MessageParser.js
class MessageParser {
    constructor(actionProvider, state) {
      this.actionProvider = actionProvider;
      this.state = state;
    }
  
    parse(message) {
      const lowercaseMessage = message.toLowerCase();
  
      if (lowercaseMessage.includes("hello") || lowercaseMessage.includes("hi")) {
        this.actionProvider.greet();
      } else if (lowercaseMessage.includes("problem")) {
        this.actionProvider.handleProblemQuestion();
      } else if (lowercaseMessage.includes("solution")) {
        this.actionProvider.handleSolutionQuestion();
      } else if (lowercaseMessage.includes("customer") || lowercaseMessage.includes("target")) {
        this.actionProvider.handleCustomerQuestion();
      } else if (lowercaseMessage.includes("use case") || lowercaseMessage.includes("example")) {
        this.actionProvider.handleUseCaseQuestion();
      } else if (lowercaseMessage.includes("help")) {
        this.actionProvider.handleHelp();
      } else {
        this.actionProvider.handleUnknown();
      }
    }
  }
  
  export default MessageParser;
  