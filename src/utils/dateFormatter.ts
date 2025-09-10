/**
 * Formats an ISO 8601 date string to a localized date and time format
 * @param isoDateString - The ISO 8601 date string (e.g., "2025-08-04T16:18:11Z")
 * @param locale - The locale to format the date for (defaults to user's browser locale)
 * @returns A formatted date string (e.g., "04.08.2025, 16:18" for German locale)
 */
export function formatDateTime(isoDateString: string, locale?: string): string {
	try {
		const date = new Date(isoDateString);

		// Check if the date is valid
		if (isNaN(date.getTime())) {
			return isoDateString; // Return original string if invalid
		}

		// Use the provided locale or browser's locale
		const targetLocale = locale || navigator.language;

		// Format the date with localized date and time
		return date.toLocaleString(targetLocale, {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			hour12: false, // Use 24-hour format
		});
	} catch (error) {
		console.error('Error formatting date:', error);
		return isoDateString; // Return original string if error occurs
	}
}

/**
 * Formats an ISO 8601 date string to a localized date format only
 * @param isoDateString - The ISO 8601 date string (e.g., "2025-08-04T16:18:11Z")
 * @param locale - The locale to format the date for (defaults to user's browser locale)
 * @returns A formatted date string (e.g., "04.08.2025" for German locale)
 */
export function formatDate(isoDateString: string, locale?: string): string {
	try {
		const date = new Date(isoDateString);

		// Check if the date is valid
		if (isNaN(date.getTime())) {
			return isoDateString; // Return original string if invalid
		}

		// Use the provided locale or browser's locale
		const targetLocale = locale || navigator.language;

		// Format only the date part
		return date.toLocaleDateString(targetLocale, {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
		});
	} catch (error) {
		console.error('Error formatting date:', error);
		return isoDateString; // Return original string if error occurs
	}
}
