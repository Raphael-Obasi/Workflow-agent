import express from "express";
import dotenv from "dotenv";
import { processEmail } from "./agent.js";
import { saveRecord, getAll } from "./db.js";

dotenv.config();

const app = express();
app.use(express.json());

// Process email
app.post("/process-email", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email required" });
    }

    const result = await processEmail(email);
    const saved = saveRecord(result);

    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// View stored records
app.get("/records", (req, res) => {
  res.json(getAll());
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
