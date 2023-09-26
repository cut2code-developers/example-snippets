/* eslint-disable no-undef */
document.addEventListener('DOMContentLoaded', () => {
	const searchInput = document.getElementById('search-input');
	const resultsContainer = document.getElementById('search-results');
	const DEBOUNCE_TIME = 500;
	let timeoutId;

	const fetchResults = async query => {
		const response = await fetch(`${vars.homeUrl}/wp-json/dynamic/v1/search/?query=${query}`);
		if (!response.ok) throw new Error(response.statusText);
		return response.json();
	};

	const handleInput = () => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(async () => {
			const query = searchInput.value.trim();
			if (query.length < 3) {
				resultsContainer.innerHTML = '';
				return;
			}

			try {
				const data = await fetchResults(query);
				const html = data.length ? `
					<h2 class="results__title">Results</h2>
					<ul class="results__list">${data.map(post => post.html).join('')}</ul>
					<a href="${vars.homeUrl}/?s=${query}" class="results__more">Show all</a>` : '<h2 class="no-results">No results found</h2>';

				resultsContainer.innerHTML = html;
			} catch (error) {
				resultsContainer.innerHTML = '<p class="error">There was an error fetching the search results. Please try again later.</p>';
			}
		}, DEBOUNCE_TIME);
	};

	searchInput.addEventListener('input', handleInput);
});