// Utility module to provide start and end dates for data fetching

// Returns date string in YYYY-MM-DD format
function formatDate(date) {
  return date.toISOString().split('T')[0];
}

// Calculate endDate as today's date
const endDateObj = new Date();
const endDate = formatDate(endDateObj);

// Calculate startDate as three days before today
const startDateObj = new Date();
startDateObj.setDate(startDateObj.getDate() - 3);
const startDate = formatDate(startDateObj);

export const dates = { startDate, endDate };
