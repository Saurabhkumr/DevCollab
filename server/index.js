const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = 5000;

// Enable CORS for all origins
app.use(cors());

// Alternatively, to allow requests from specific origins, you can do:
app.use(
  cors({
    origin: "http://localhost:5173", // Change this to your frontend URL
  })
);
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
        "x-rapidapi-key": "2f36b6c133msh964824813abc8f1p1055f3jsne9a1ad6e6967",
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
        "Content-Type": "application/json",
      },
      data: JSON.stringify({
        language_id,
        source_code: Buffer.from(source_code).toString("base64"),
        stdin: Buffer.from(stdin || "").toString("base64"), // Handle stdin if provided
      }),
    };

    const response = await axios.request(options);
    const { stdout, stderr, compile_output } = response.data;

    // Decode stdout and stderr if they are base64 encoded
    const decodedStdout = stdout
      ? Buffer.from(stdout, "base64").toString("utf-8")
      : "";
    const decodedStderr = stderr
      ? Buffer.from(stderr, "base64").toString("utf-8")
      : "";
    const decodedCompileOutput = compile_output
      ? Buffer.from(compile_output, "base64").toString("utf-8")
      : "";

    res.json({
      stdout: decodedStdout,
      stderr: decodedStderr,
      compile_output: decodedCompileOutput,
    });
  } catch (error) {
    console.error("Error calling Judge0 API:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
