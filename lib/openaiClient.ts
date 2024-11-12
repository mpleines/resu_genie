import axios from "axios";

axios.defaults.headers.common[
  "Authorization"
] = `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`;

const completions = async (prompt: string) => {
  return axios.post("https://api.openai.com/v1/chat/completions", {
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });
};

const openAiClient = {
  completions,
};

export default openAiClient;
