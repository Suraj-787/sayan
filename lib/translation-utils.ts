
// Example utility function for translations
export function translate(key: string, translations: Record<string, string>): string {
	return translations[key] || key;
}
