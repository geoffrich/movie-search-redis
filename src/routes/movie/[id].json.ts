import type { RequestHandler } from '@sveltejs/kit';
import type * as TMDB from '$lib/types/tmdb';
import type { Movie } from '$lib/types';

export const get: RequestHandler = async function ({ params }) {
	const { id } = params;
	const [movieResponse, creditsResponse] = await Promise.all([getMovieDetails(id), getCredits(id)]);
	if (movieResponse.ok) {
		const movie = await movieResponse.json();
		const credits = await creditsResponse.json();
		return {
			body: adaptResponse(movie, credits)
		};
	}
	return {
		status: movieResponse.status
	};
};

async function getMovieDetails(id: string) {
	return await fetch(
		`https://api.themoviedb.org/3/movie/${id}?api_key=${process.env['TMDB_API_KEY']}`
	);
}

async function getCredits(id: string) {
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
		title: movie.title
	};
}
