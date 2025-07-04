[![light logo](https://mintlify.s3.us-west-1.amazonaws.com/firecrawl/logo/logo.png)][firecrawl-home]
[![dark logo](https://mintlify.s3.us-west-1.amazonaws.com/firecrawl/logo/logo-dark.png)][firecrawl-home]

# [Firecrawl Docs](https://firecrawl.dev/)

## Welcome to Firecrawl

[Firecrawl](https://firecrawl.dev/?ref=github) is an API service that takes a URL, crawls it, and converts it into clean markdown. We crawl all accessible subpages and give you clean markdown for each — no sitemap required.

![Hero Light](https://mintlify.s3.us-west-1.amazonaws.com/firecrawl/images/turn-websites-into-llm-ready-data--firecrawl.jpg)

## How to use it?

We provide an easy-to-use API with our hosted version. You can find the playground and documentation [here](https://firecrawl.dev/playground). You can also self-host the backend if you'd like.

### Quick Links

- **API**: [Documentation](https://docs.firecrawl.dev/api-reference/introduction)
- **SDKs**: 
  - [Python](https://docs.firecrawl.dev/sdks/python) 
  - [Node](https://docs.firecrawl.dev/sdks/node) 
  - [Go](https://docs.firecrawl.dev/sdks/go) 
  - [Rust](https://docs.firecrawl.dev/sdks/rust)
- **LLM Frameworks**:
  - [Langchain (Python)](https://python.langchain.com/docs/integrations/document_loaders/firecrawl/)
  - [Langchain (JS)](https://js.langchain.com/docs/integrations/document_loaders/web_loaders/firecrawl)
  - [Llama Index](https://docs.llamaindex.ai/en/latest/examples/data_connectors/WebPageDemo/#using-firecrawl-reader)
  - [Crew.ai](https://docs.crewai.com/)
  - [Composio](https://composio.dev/tools/firecrawl/all)
  - [PraisonAI](https://docs.praison.ai/firecrawl/)
  - [Superinterface](https://superinterface.ai/docs/assistants/functions/firecrawl)
  - [Vectorize](https://docs.vectorize.io/integrations/source-connectors/firecrawl)
- **Low-code Frameworks**:
  - [Dify](https://dify.ai/blog/dify-ai-blog-integrated-with-firecrawl)
  - [Langflow](https://docs.langflow.org/)
  - [Flowise AI](https://docs.flowiseai.com/integrations/langchain/document-loaders/firecrawl)
  - [Cargo](https://docs.getcargo.io/integration/firecrawl)
  - [Pipedream](https://pipedream.com/apps/firecrawl/)
- **Others**:
  - [Zapier](https://zapier.com/apps/firecrawl/integrations)
  - [Pabbly Connect](https://www.pabbly.com/connect/integrations/firecrawl/)

Want an SDK or Integration? Open an issue and let us know.

**Self-hosting**: Refer to the guide [here](https://docs.firecrawl.dev/contributing/self-host).

---

## API Key

To use the API, sign up at [Firecrawl](https://firecrawl.dev/) and get your API key.

---

## Features

- **[Scrape](https://docs.firecrawl.dev/introduction#scraping)**: Get LLM-ready formats like markdown, HTML, screenshots, and structured data.
- **[Crawl](https://docs.firecrawl.dev/introduction#crawling)**: Crawl all accessible URLs from a page.
- **[Map](https://docs.firecrawl.dev/features/map)**: Discover all URLs on a domain—super fast.
- **[Search](https://docs.firecrawl.dev/features/search)**: Search the web and retrieve full content.
- **[Extract](https://docs.firecrawl.dev/features/extract)**: AI-powered data extraction from single or multiple pages.

---

## Powerful Capabilities

- **LLM-ready formats**: markdown, structured data, screenshot, HTML, links, metadata.
- **Handles complexities**: proxies, anti-bot, JS-rendered content, and output parsing.
- **Customizability**: crawl behind auth walls, exclude tags, set depth, headers, etc.
- **Media parsing**: PDFs, DOCX, images.
- **Reliable**: built for resilience and accuracy.
- **Actions**: click, scroll, input, wait before extract.

More in the [documentation](https://docs.firecrawl.dev/).

---

## Installing Firecrawl

### Python

```bash
pip install firecrawl-py
```

---

## Scraping

To scrape a single URL:

```python
from firecrawl import FirecrawlApp

app = FirecrawlApp(api_key="fc-YOUR_API_KEY")

# Scrape a website
scrape_result = app.scrape_url('firecrawl.dev', formats=['markdown', 'html'])
print(scrape_result)
```

### Example Response

```json
{
  "success": true,
  "data": {
    "markdown": "Launch Week I is here! ...",
    "html": "<!DOCTYPE html><html lang=\"en\"> ...",
    "metadata": {
      "title": "Home - Firecrawl",
      "description": "Firecrawl crawls and converts any website into clean markdown.",
      "language": "en",
      "keywords": "Firecrawl,Markdown,Data,Mendable,Langchain",
      "robots": "follow, index",
      "ogTitle": "Firecrawl",
      "ogDescription": "Turn any website into LLM-ready data.",
      "ogUrl": "https://www.firecrawl.dev/",
      "ogImage": "https://www.firecrawl.dev/og.png?123",
      "sourceURL": "https://firecrawl.dev",
      "statusCode": 200
    }
  }
}
```

---

## Crawling

Submit a crawl job to get all subpages:

```python
from firecrawl import FirecrawlApp, ScrapeOptions

app = FirecrawlApp(api_key="fc-YOUR_API_KEY")

crawl_result = app.crawl_url(
  'https://firecrawl.dev',
  limit=10,
  scrape_options=ScrapeOptions(formats=['markdown', 'html']),
)
print(crawl_result)
```

### Response

```json
{
  "success": true,
  "id": "123-456-789",
  "url": "https://api.firecrawl.dev/v1/crawl/123-456-789"
}
```

---

## Check Crawl Job

```python
crawl_status = app.check_crawl_status("<crawl_id>")
print(crawl_status)
```

### Example (in progress)

```json
{
  "status": "scraping",
  "total": 36,
  "completed": 10,
  "creditsUsed": 10,
  "expiresAt": "2024-00-00T00:00:00.000Z",
  "next": "https://api.firecrawl.dev/v1/crawl/123-456-789?skip=10",
  "data": [
    {
      "markdown": "...",
      "html": "...",
      "metadata": {
        "title": "Build a 'Chat with website' using Groq Llama 3 | Firecrawl",
        "language": "en",
        "sourceURL": "https://docs.firecrawl.dev/learn/rag-llama3",
        "description": "Learn how to use Firecrawl, Groq Llama 3, and Langchain to build a 'Chat with your website' bot.",
        "statusCode": 200
      }
    }
  ]
}
```

---

## Extraction (LLM-Based)

With LLM extraction, you can extract structured data using schemas.

**Supported in:** Python, Node.js, cURL

### Python Example

```python
from firecrawl import JsonConfig, FirecrawlApp
from pydantic import BaseModel

class ExtractSchema(BaseModel):
    company_mission: str
    supports_sso: bool
    is_open_source: bool
    is_in_yc: bool

app = FirecrawlApp(api_key="<YOUR_API_KEY>")
json_config = JsonConfig(schema=ExtractSchema)

llm_extraction_result = app.scrape_url(
    'https://firecrawl.dev',
    formats=["json"],
    json_options=json_config
)
print(llm_extraction_result)
```

---

[firecrawl-home]: https://firecrawl.dev/
