// src/components/ActionProvider.js
class ActionProvider {
    constructor(createChatBotMessage, setStateFunc, createClientMessage) {
      this.createChatBotMessage = createChatBotMessage;
      this.setState = setStateFunc;
      this.createClientMessage = createClientMessage;
    }
  
    greet() {
      const message = this.createChatBotMessage("Hello there! How can I help you?");
      this.updateChatbotState(message);
    }
  
    handleHelp() {
      const message = this.createChatBotMessage(
        "You can ask me questions about the problem, solutions, target customers, or use cases of the product."
      );
      this.updateChatbotState(message);
    }
  
    handleProblemQuestion() {
      const problem = this.state.analysis?.problem || "I don't have enough information about that.";
      const message = this.createChatBotMessage(problem);
      this.updateChatbotState(message);
    }
  
    handleSolutionQuestion() {
      const solutions = this.state.analysis?.solutions || "I don't have enough information about that.";
      const message = this.createChatBotMessage(solutions);
      this.updateChatbotState(message);
    }
  
    handleCustomerQuestion() {
      const customers = this.state.analysis?.customers || "I don't have enough information about that.";
      const message = this.createChatBotMessage(customers);
      this.updateChatbotState(message);
    }
  
    handleUseCaseQuestion() {
      const useCases = this.state.analysis?.useCases || "I don't have enough information about that.";
      const message = this.createChatBotMessage(useCases);
      this.updateChatbotState(message);
    }
  
    handleUnknown() {
      const message = this.createChatBotMessage(
        "I'm not sure I understand. You can ask me about the problem, solutions, target customers, or use cases of the product."
      );
      this.updateChatbotState(message);
    }
  
    updateChatbotState(message) {
      this.setState((prevState) => ({
        ...prevState,
        messages: [...prevState.messages, message],
      }));
    }
  }
  
  export default ActionProvider;
  