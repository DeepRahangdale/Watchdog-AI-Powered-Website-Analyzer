// import OpenAI from "openai"; 

// const openai = new OpenAI({
//     apiKey: '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', 
//     // baseURL: "https://api.pawan.krd/gpt-3.5-unfiltered/v1", 
//     dangerouslyAllowBrowser: true 
// });

// export default openai; 


import MistralClient from '@mistralai/mistralai';

const apiKey = process.env.MISTRAL_API_KEY; 
const client = new MistralClient(apiKey);
export default client;

