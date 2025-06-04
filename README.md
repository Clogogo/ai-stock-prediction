# Stock Prediction

A simple web application that lets you enter up to 3 stock tickers, fetches recent data via the Polygon.io API, and uses Google's Gemini AI to generate a concise performance report with buy/hold/sell recommendations.

## Features

- Add up to 3 stock tickers
- Fetch 3-day aggregated price data from Polygon.io
- Generate a styled 150-word summary and recommendation using Gemini AI (`gemini-2.0-flash` model)
- Minimal, responsive UI with optional Bootstrap styling

## Tech Stack

- JavaScript (ES Modules)
- Vite for bundling and environment variable management
- Polygon.io API for stock market data
- Google GenAI (`@google/genai`) client for AI content generation
- (Optional) Bootstrap & Bootstrap Icons for styling

## Setup & Installation

1. **Clone the repository**



2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure API keys**

   Create a `.env` file in the project root with the following variables:

   ```ini
   VITE_POLYGON_API_KEY=your_polygon_api_key_here
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

   Open <http://localhost:5173> in your browser.

## Usage

1. Enter a valid stock ticker (e.g., `AAPL`) and click **Add**.
2. Repeat for up to three tickers.
3. Click **Generate Report** to fetch data and generate the AI report.
4. View the report displayed on the page.

## Project Structure

```text
/ (root)
├── index.html       # Main HTML entry point
├── index.js         # App logic (fetches data, calls AI, renders UI)
├── index.css        # Styles (or use Bootstrap)
├── utils/
│   └── dates.js     # Utility for computing date ranges
├── .env             # Local environment variables (API keys)
├── package.json     # NPM dependencies & scripts
└── README.md        # This documentation
```

## How It Was Built

- Started as a static HTML/CSS/JS project.
- Migrated to Vite to enable environment variables (`import.meta.env`) and ES modules.
- Integrated Polygon.io API to retrieve recent stock aggregates.
- Integrated Google GenAI client (`@google/genai`) to call Gemini AI for report generation, passing prompt messages and data.
- Enhanced UI with minimal Bootstrap or custom CSS for a clean, responsive experience.

## Notes

- Ensure your API keys have the correct permissions and quota.
- If using the free tier of Gemini, watch for rate limits.

## License

MIT License

