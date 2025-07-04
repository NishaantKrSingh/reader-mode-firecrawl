import dotenv from "dotenv";
import express from "express";
import FirecrawlApp from "@mendable/firecrawl-js";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const apiKey = process.env.FIRECRAWL_API_KEY;

if (!apiKey) {
  throw new Error("FIRECRAWL_API_KEY is not set in .env");
}

const firecrawl = new FirecrawlApp({ apiKey });

app.use(cors());
app.use(express.json());

app.post("/scrape", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: "URL is required" });

  try {
    console.log(`Scraping URL: ${url}`);
    const result = await firecrawl.scrapeUrl(url, {
      formats: ["markdown"], // Only supported parameter(s)
    });

    if (result.success && result.markdown) {
      res.json({ content: result.markdown });
    } else {
      console.error("No content returned:", result);
      res
        .status(500)
        .json({ error: "Scraping succeeded but returned no content" });
    }
  } catch (err) {
    console.error("Error during scraping:", err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
