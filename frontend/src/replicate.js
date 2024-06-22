// src/replicate.js
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REACT_APP_REPLICATE_API_TOKEN,
});

export default replicate;
