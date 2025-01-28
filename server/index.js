require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios");

const apikey = process.env.apikey;

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post("/run", async (req, res) => {
  const { source_code, language_id, stdin } = req.body;

  try {
    const options = {
      method: "POST",
      url: "https://judge0-ce.p.rapidapi.com/submissions",
      params: {
        base64_encoded: "true",
        wait: "true",
        fields: "*",
      },
      headers: {
        "x-rapidapi-key": apikey,
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        language_id,
        source_code: Buffer.from(source_code).toString("base64"),
        stdin: Buffer.from(stdin || "").toString("base64"),
      }),
    };

    const response = await axios.request(options);
    const { stdout, stderr, compile_output } = response.data;

    res.json({
      stdout: stdout ? Buffer.from(stdout, "base64").toString("utf-8") : "",
      stderr: stderr ? Buffer.from(stderr, "base64").toString("utf-8") : "",
      compile_output: compile_output
        ? Buffer.from(compile_output, "base64").toString("utf-8")
        : "",
    });
  } catch (error) {
    console.error("Error calling Judge0 API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
