import type { RequestHandler } from '@sveltejs/kit';
import type { SearchResponse } from '$lib/types/tmdb';
import redis, { MOVIE_IDS_KEY } from '$lib/redis';

const VOTE_THRESHOLD = 20;

export const get: RequestHandler = async function ({ query }) {
	const searchQuery = query.get('query');
	const page = query.get('page') ?? 1;
	const response = await fetch(
		`https://api.themoviedb.org/3/search/movie?api_key=${process.env['TMDB_API_KEY']}&page=${page}&include_adult=false&query=${searchQuery}`
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

	return {
		body: parsed
	};
};
