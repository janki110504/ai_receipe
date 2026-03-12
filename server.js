const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const OpenAI = require("openai");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1"
});

app.post("/generateRecipe", async (req, res) => {

  console.log("Recipe request:", req.body);

  try {

    const food = req.body.food;

    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: `Give a full recipe for ${food}. Include:
Ingredients with quantity
Cooking time
Step-by-step cooking instructions`
        }
      ]
    });

    res.json({
      recipe: completion.choices[0].message.content
    });

  } catch (error) {

    console.error("Groq API Error:", error);

    res.status(500).json({
      error: "Recipe generation failed"
    });

  }

});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});