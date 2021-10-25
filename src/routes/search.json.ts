import type { RequestHandler } from '@sveltejs/kit';
import type { SearchResponse } from '$lib/types/tmdb';
import { MOVIE_IDS_KEY } from '$lib/redis';

import Redis from 'ioredis';

export const get: RequestHandler = async function ({ query }) {
	const searchQuery = query.get('query');
	const page = query.get('page') ?? 1;
	const response = await fetch(
		`https://api.themoviedb.org/3/search/movie?api_key=${process.env['TMDB_API_KEY']}&page=${page}&include_adult=false&query=${searchQuery}`
	);
	const parsed: SearchResponse = await response.json();

	try {
		// TODO: use connection string
		const redis = new Redis();
		await redis.sadd(MOVIE_IDS_KEY, ...parsed.results.map((r) => r.id));
	} catch (e) {
		console.log(e);
	}

	return {
		body: parsed
	};
};
