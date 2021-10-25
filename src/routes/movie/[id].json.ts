import type { RequestHandler } from '@sveltejs/kit';
import type * as TMDB from '$lib/types/tmdb';
import type { Movie, MovieDetails } from '$lib/types';
import { getMovieKey, initRedis } from '$lib/redis';
import type Redis from 'ioredis';

export const get: RequestHandler = async function ({ params }) {
	const { id: rawId } = params;
	// validate and sanitize the input
	const id = parseInt(rawId);
	if (isNaN(id)) {
		return {
			status: 400
		};
	}

	const redis = initRedis();
	const { movie, credits } = await getMovieDetailsFromCache(redis, id);
	if (movie && credits) {
		return {
			body: adaptResponse(movie, credits)
		};
	}

	const result = await getMovieDetailsFromApi(redis, id);
	const { movie: apiMovie, credits: apiCredits, status } = result;
	if (status) {
		return {
			status
		};
	}

	return {
		body: adaptResponse(apiMovie, apiCredits)
	};
};

async function getMovieDetailsFromCache(
	redis: Redis,
	id: number
): Promise<MovieDetails | Record<string, never>> {
	const cached: string = await redis.get(getMovieKey(id));
	if (cached) {
		const parsed: MovieDetails = JSON.parse(cached);
		console.log(`Found ${id} in cache`);
		return parsed;
	}
	return {};
}

async function getMovieDetailsFromApi(redis: Redis, id: number) {
	const [movieResponse, creditsResponse] = await Promise.all([getMovieDetails(id), getCredits(id)]);
	if (movieResponse.ok) {
		const movie = await movieResponse.json();
		const credits = await creditsResponse.json();
		await cacheMovieResponse(redis, id, movie, credits);
		return {
			movie,
			credits
		};
	}

	return {
		status: movieResponse.status
	};
}

async function cacheMovieResponse(redis: Redis, id: number, movie, credits) {
	try {
		const cache: MovieDetails = {
			movie,
			credits
		};
		// store movie response for 24 hours
		await redis.set(getMovieKey(id), JSON.stringify(cache), 'EX', 24 * 60 * 60);
	} catch (e) {
		console.log('Unable to cache', id, e);
	}
}

async function getMovieDetails(id: number) {
	return await fetch(
		`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env['TMDB_API_KEY']}`
	);
}

async function getCredits(id: number) {
	return await fetch(
		`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env['TMDB_API_KEY']}`
	);
}

function adaptResponse(movie: TMDB.Movie, credits: TMDB.MovieCreditsResponse): Movie {
	const { cast, crew } = credits;
	return {
		budget: movie.budget,
		cast: cast ? cast.map((c) => ({ name: c.name, role: c.character })) : [],
		crew: crew ? crew.map((c) => ({ name: c.name, role: c.job })) : [],
		genres: movie.genres.map((g) => g.name),
		id: movie.id,
		overview: movie.overview,
		poster_path: movie.poster_path,
		production_companies: movie.production_companies.map((c) => c.name),
		release_date: movie.release_date,
		revenue: movie.revenue,
		runtime: movie.runtime,
		tagline: movie.tagline,
		title: movie.title,
		imdb_id: movie.imdb_id
	};
}
