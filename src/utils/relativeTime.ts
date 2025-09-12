/**
 * Utility functions for calculating relative time differences
 */

export function getRelativeTime(dateString: string): string {
	try {
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();

		// If the date is in the future, handle it gracefully
		if (diffMs < 0) {
			const futureDiffMs = Math.abs(diffMs);
			return getRelativeTimeString(futureDiffMs, true);
		}

		return getRelativeTimeString(diffMs, false);
	} catch (error) {
		return 'Invalid date';
	}
}

function getRelativeTimeString(diffMs: number, isFuture: boolean = false): string {
	const seconds = Math.floor(diffMs / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);
	const weeks = Math.floor(days / 7);
	const months = Math.floor(days / 30.44); // Average month length
	const years = Math.floor(days / 365.25); // Account for leap years

	const suffix = isFuture ? 'from now' : 'ago';

	if (years > 0) {
		return `${years} ${years === 1 ? 'year' : 'years'} ${suffix}`;
	} else if (months > 0) {
		return `${months} ${months === 1 ? 'month' : 'months'} ${suffix}`;
	} else if (weeks > 0) {
		return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ${suffix}`;
	} else if (days > 0) {
		return `${days} ${days === 1 ? 'day' : 'days'} ${suffix}`;
	} else if (hours > 0) {
		return `${hours} ${hours === 1 ? 'hour' : 'hours'} ${suffix}`;
	} else if (minutes > 0) {
		return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ${suffix}`;
	} else if (seconds > 30) {
		return `${seconds} ${seconds === 1 ? 'second' : 'seconds'} ${suffix}`;
	} else {
		return isFuture ? 'in a moment' : 'just now';
	}
}