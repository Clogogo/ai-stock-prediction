import { dates } from '../utils/dates.js';

const tickersArr = [];
const generateReportBtn = document.querySelector('.generate-report-btn');

generateReportBtn.addEventListener('click', fetchStockData);

document.getElementById('ticker-input-form').addEventListener('submit', (e) => {
	e.preventDefault();
	const tickerInput = document.getElementById('ticker-input');
	if (tickerInput.value.length > 2) {
		generateReportBtn.disabled = false;
		tickersArr.push(tickerInput.value.toUpperCase());
		tickerInput.value = '';
		renderTickers();
	} else {
		const label = document.getElementsByTagName('label')[0];
		label.style.color = 'red';
		label.textContent = 'You must add at least one ticker. A ticker is a 3 letter or more code for a stock. E.g TSLA for Tesla.';
	}
});

function renderTickers() {
	const tickersDiv = document.querySelector('.ticker-choice-display');
	tickersDiv.innerHTML = '';
	tickersArr.forEach((ticker) => {
		const span = document.createElement('span');
		span.textContent = ticker;
		span.classList.add('ticker');
		tickersDiv.appendChild(span);
	});
}

const loadingArea = document.querySelector('.loading-panel');
const apiMessage = document.getElementById('api-message');
loadingArea.style.display = 'none';

async function fetchStockData() {
	document.querySelector('.action-panel').style.display = 'none'
	loadingArea.style.display = 'flex'
	try {
		const stockData = await Promise.all(tickersArr.map(async (ticker) => {
			const url = `https://api.polygon.io/v2/aggs/ticker/${ticker}/range/1/day/${dates.startDate}/${dates.endDate}?apiKey=_8VPlJQCWFMhGpWHQqN_Tlf85VcOGZbb`;;
			const response = await fetch(url)
			const data = await response.text()
			const status = await response.status
			if (status === 200) {
				apiMessage.innerText = 'Creating report...'
				return data
			} else {
				loadingArea.innerText = 'There was an error fetching stock data.'
			}
		}))
		fetchReport(stockData.join(''))
	} catch (err) {
		loadingArea.innerText = 'There was an error fetching stock data.'
		console.error(err.message)
	}
}

async function fetchReport(data) {
    // Build messages array
    const messages = [
        { role: 'system', content: 'You are a trading guru. Given data on share prices over the past 3 days, write a report of no more than 150 words describing the stocks performance and recommending whether to buy, hold or sell. Use the examples provided between ### to set the style your response.'},
        { role: 'user', content: data }
    ];
    try {
        apiMessage.innerText = 'Generating AI report...';
        const response = await fetch('/report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages })
        });
        if (!response.ok) throw new Error(`Report API error: ${response.status}`);
        const json = await response.json();
        renderReport(json.text);
    } catch (err) {
        console.error(err);
        loadingArea.innerText = 'Unable to access AI. Please refresh and try again';
    }
}


function renderReport(text) {
	loadingArea.style.display = 'none';
	const output = document.querySelector('.output-panel');
	const p = document.createElement('p');
	p.textContent = text;
	output.appendChild(p);
	output.style.display = 'flex';
}
