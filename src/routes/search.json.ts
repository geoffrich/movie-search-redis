import type { RequestHandler } from '@sveltejs/kit';
import type { SearchResponse } from '$lib/types/tmdb';

export const get: RequestHandler = async function ({ query }) {
	const searchQuery = query.get('query');
	const page = query.get('page') ?? 1;
	const response = await fetch(
		`https://api.themoviedb.org/3/search/movie?api_key=${process.env['TMDB_API_KEY']}&page=${page}&include_adult=false&query=${searchQuery}`
	);
	const parsed: SearchResponse = await response.json();
	return {
		body: parsed
	};
};
