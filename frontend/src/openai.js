


import MistralClient from '@mistralai/mistralai';

const apiKey = process.env.MISTRAL_API_KEY; 
const client = new MistralClient(apiKey);
export default client;

