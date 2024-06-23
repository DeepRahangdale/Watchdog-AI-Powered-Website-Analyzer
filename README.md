# WebWatchdog-AI Powered Website Analyzer

## Overview

This application empowers users to gain insightful analysis of any website using an AI model (Mistral). It extracts key information about the product or service offered, including the problem it solves, the solution provided, target audience, and potential use cases. Users can then interact with an AI chatbot to delve deeper into the analysis or ask further questions about the website's content.
### Demo Screen Recording: [**WebWatchdog-AI Powered Website Analyzer**](https://drive.google.com/file/d/1ebSpHwwltUNMXxYUnZWtVrZzlJYm0aW_/view?usp=drive_link)
## Features

* **Website Analysis:** Extracts relevant text from a specified website URL.
* **AI-Powered Insights:** Leverages the Mistral AI model to analyze the website text and generate a comprehensive summary focusing on key product/service aspects.
* **Interactive Chatbot:** Enables users to engage in a conversation with an AI chatbot to explore the analysis results in more detail or ask questions.
* **User Authentication (Firebase):** Ensures secure access and user management through Firebase authentication, supporting both email/password and Google sign-in.

## Technologies Used

* **Frontend:** React
* **Backend:** Node.js, Express.js, Puppeteer
* **AI Model:** Mistral
* **Authentication:** Firebase

## Installation and Setup

**Prerequisites:**

* Node.js and npm (or yarn)
* Firebase project with authentication enabled
* Mistral API key

**Backend Setup:**

1. Clone this repository.
2. Navigate to the `backend` directory: `cd backend`
3. Install dependencies: `npm install`
4. Create a `.env` file in the `backend` directory and add your Mistral API key: MISTRAL_API_KEY=your_mistral_api_key
5. Run the server: `npm start`

**Frontend Setup:**

1. Navigate to the `frontend` directory: `cd frontend`
2. Install dependencies: `npm install`
3. Update `firebase.js` with your Firebase configuration details.
4. Start the development server: `npm start`

## Usage

1. Open the application in your browser.
2. If required, log in or sign up using your email/password or Google account.
3. Enter the website URL you want to analyze.
4. Click "Analyze."
5. Once the website text is fetched, a chatbot window will appear.
6. Interact with the chatbot to ask questions about the website or the analysis results.

## Contributing

Contributions are encouraged! Feel free to fork the repository, make improvements, and submit pull requests. 

## License

This project is licensed under the MIT License.

