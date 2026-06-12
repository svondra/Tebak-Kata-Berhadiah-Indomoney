import cors from "cors";
import express from "express";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const quizPath = path.join(__dirname, "quiz.json");

const app = express();
const port = Number(process.env.PORT || 3000);
const editorId = process.env.EDITOR_ID || "indomoney";
const editorPassword = process.env.EDITOR_PASSWORD || "selenacantik";
const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";

app.use(cors({ origin: allowedOrigin === "*" ? true : allowedOrigin }));
app.use(express.json({ limit: "64kb" }));

function cleanLevel(level) {
  return {
    prefix: String(level?.prefix || "").replace(/\s/g, "").toUpperCase(),
    answer: String(level?.answer || "").replace(/[^a-z]/gi, "").toUpperCase(),
    suffix: String(level?.suffix || "").replace(/\s/g, "").toUpperCase(),
    hint: String(level?.hint || "").trim()
  };
}

function cleanLevels(levels) {
  if (!Array.isArray(levels)) {
    throw new Error("levels must be an array");
  }

  const cleaned = levels.map(cleanLevel);
  if (cleaned.length === 0 || cleaned.some((level) => !level.answer || !level.hint)) {
    throw new Error("each level needs an answer and hint");
  }

  return cleaned;
}

async function readQuiz() {
  const raw = await readFile(quizPath, "utf8");
  const parsed = JSON.parse(raw);
  return { levels: cleanLevels(parsed.levels) };
}

async function writeQuiz(levels) {
  const quiz = { levels: cleanLevels(levels) };
  await writeFile(quizPath, `${JSON.stringify(quiz, null, 2)}\n`, "utf8");
  return quiz;
}

app.get("/api/health", (_request, response) => {
  response.json({ ok: true });
});

app.get("/api/quiz", async (_request, response) => {
  try {
    response.json(await readQuiz());
  } catch (error) {
    response.status(500).json({ error: "Could not load quiz" });
  }
});

app.post("/api/quiz", async (request, response) => {
  const { id, password, levels } = request.body || {};

  if (id !== editorId || password !== editorPassword) {
    response.status(401).json({ error: "Invalid editor credentials" });
    return;
  }

  try {
    response.json(await writeQuiz(levels));
  } catch (error) {
    response.status(400).json({ error: error.message || "Invalid quiz data" });
  }
});

app.listen(port, () => {
  console.log(`IndoMoney quiz backend running on port ${port}`);
});
