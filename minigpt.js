const openAI = require("openai")
const express = require("express");
const Replicate = require("replicate");
const { promises: fs } = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import the cors package
const newConfig = new openAI.Configuration({
  apiKey: "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",
});
const openai = new openAI.OpenAIApi(newConfig);
const app = express();
const port = 8081;

const replicate = new Replicate({
  auth: "7ac4afe3255b290c84685eb8e94e7e86884673d7",
});

app.use(cors()); // Use the cors middleware to allow all origins

app.use(bodyParser.json({ limit: "50mb" }));

app.post("/get-GPT4", async (req, res) => {
  try {
    const { imageDesc } = req.body;

    if (!imageDesc) {
      return res.status(400).json({ error: "Missing Image Description" });
    }
    
    const chatHistory = [];

    const messageList = chatHistory.map(([input_text, completion_text]) => ({
      role: "user" === input_text ? "ChatGPT" : "user",
      content: input_text,
    }));

    messageList.push({
      role: "user",
      content:
        `${imageDesc}` + '\n\n' +
        "This is the description of a digital advertisement that I have to create. " +
        "Suggest realistic background ideas for ads as prompts that I can enter into DALLE. " + 
        "List the prompts out. Your answer should only contain this list of prompts.",
    });

    const GPTOutput = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messageList,
    });

    const output_text = GPTOutput.data.choices[0].message.content;
    
    return res.status(200).json(output_text);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

app.post("/create-bg", async (req, res) => {
  try {
    const { photo, prompt } = req.body;

    if (!photo || !prompt) {
      return res.status(400).json({ error: "Missing Uploaded file or prompt data." });
    }

    const clipdropApiKey = "ba1938f624f0cf7ee71d73473a984b6fa554571577e2039b889c721ff3e29f28e0b6b9dcd239e815b8d1ca48bf927680";
    const form = new FormData();
    form.append("image_file", photo);
    form.append("prompt", prompt);

    try {
      const response = await fetch(
        "https://clipdrop-api.co/replace-background/v1",
        {
          method: "POST",
          headers: {
            "x-api-key": clipdropApiKey,
          },
          body: form,
        }
      );
      return res.status(200).json(response);
    } catch (error) {
      console.error(error);
    }

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

app.post("/process-image", async (req, res) => {
  try {
    const { dataURI, prompt } = req.body;

    if (!dataURI || !prompt) {
      return res.status(400).json({ error: "Missing dataURI or prompt data." });
    }

    const model =
      "daanelson/minigpt-4:b96a2f33cc8e4b0aa23eacfce731b9c41a7d9466d9ed4e167375587b54db9423";

    const output = await processImageWithReplicate(dataURI, prompt, model);

    return res.status(200).json(output);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

const processImageWithReplicate = async (dataURI, prompt, model) => {
  // Convert the dataURI into a buffer
  const base64Data = dataURI.replace(/^data:image\/png;base64,/, "");
  const buffer = Buffer.from(base64Data, "base64");

  // Set MIME type for PNG image (you can adjust the MIME type if needed)
  const mimeType = "image/png";

  // Create the data URI
  //   const updatedDataURI = `data:${mimeType};base64,${buffer.toString('base64')}`;
  //   const updatedDataURI = `data:${mimeType};base64,${buffer.toString('base64')}`;



  const input = {
    // image: updatedDataURI,
    image: dataURI,
    prompt: prompt,
  };

  const output = await replicate.run(model, { input });

  return output;
};

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
