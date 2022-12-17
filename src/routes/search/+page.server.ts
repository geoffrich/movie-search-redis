import type { PageServerLoad } from './$types';
import type { SearchResponse } from '$lib/types/tmdb';
import { TMDB_API_KEY } from '$env/static/private';

export const load: PageServerLoad = async function ({ url, setHeaders }) {
	const searchQuery = url.searchParams.get('query');
	const page = url.searchParams.get('page') ?? 1;
	const response = await fetch(
		`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&page=${page}&include_adult=false&query=${searchQuery}`
	);
	const parsed: SearchResponse = await response.json();

	setHeaders({
		'cache-control': 'max-age=300'
	});
	return {
		searchResponse: parsed
	};
};
