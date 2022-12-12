import type { ServerLoad } from '@sveltejs/kit';
import type { SearchResponse } from '$lib/types/tmdb';
import redis, { MOVIE_IDS_KEY } from '$lib/redis';
import { env } from '$env/dynamic/private';

const VOTE_THRESHOLD = 20;

export const load: ServerLoad = async function ({ url, setHeaders }) {
	const searchQuery = url.searchParams.get('query');
	const page = url.searchParams.get('page') ?? 1;
	const response = await fetch(
		`https://api.themoviedb.org/3/search/movie?api_key=${env.TMDB_API_KEY}&page=${page}&include_adult=false&query=${searchQuery}`
	);
	const parsed: SearchResponse = await response.json();

	// filter out obscure movies
	const filteredMovies = parsed.results.filter((movie) => movie.vote_count >= VOTE_THRESHOLD);
	const removedMovies = parsed.results.filter((movie) => movie.vote_count < 20);
	console.log(
		'Filtered out:',
		removedMovies.map((m) => m.title)
	);

	if (filteredMovies.length > 0) {
		try {
			await redis.sadd(MOVIE_IDS_KEY, ...filteredMovies.map((r) => r.id));
		} catch (e) {
			console.log(e);
		}
	}

	setHeaders({
		'cache-control': 'max-age=300'
	});
	return {
		searchResponse: parsed
	};
};
