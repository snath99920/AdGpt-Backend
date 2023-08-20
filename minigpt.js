const express = require("express");
const Replicate = require("replicate");
const { promises: fs } = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors"); // Import the cors package

const app = express();
const port = 8080;

const replicate = new Replicate({
  auth: "7ac4afe3255b290c84685eb8e94e7e86884673d7",
});

app.use(cors()); // Use the cors middleware to allow all origins

app.use(bodyParser.json({ limit: "50mb" }));

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

  //   console.log(dataURI + '\n\n\n\n')
  //   console.log(updatedDataURI)

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
