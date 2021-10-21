import type { RequestHandler } from '@sveltejs/kit';
import type { SearchResponse } from '$lib/types/tmdb';

export const get: RequestHandler = async function ({ query }) {
	const searchQuery = query.get('query');
	const response = await fetch(
		`https://api.themoviedb.org/3/search/movie?api_key=${process.env['TMDB_API_KEY']}&language=en-US&page=1&include_adult=false&query=${searchQuery}`
	);
	const parsed: SearchResponse = await response.json();
	return {
		body: parsed.results
	};
};
