import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types'; // TODO: check other places
import type * as TMDB from '$lib/types/tmdb';
import type { Movie, MovieDetails } from '$lib/types';
import { TMDB_API_KEY } from '$env/static/private';

export const load: PageServerLoad = async function ({ params }) {
	const id = parseInt(params.id ?? '');

	const result = await getMovieDetailsFromApi(id);
	const { movie: apiMovie, credits: apiCredits } = result;

	return {
		movie: adaptResponse(apiMovie, apiCredits)
	};
};

async function getMovieDetailsFromApi(id: number) {
	const [movieResponse, creditsResponse] = await Promise.all([getMovieDetails(id), getCredits(id)]);
	if (movieResponse.ok) {
		const movie = await movieResponse.json();
		const credits = await creditsResponse.json();
		return {
			movie,
			credits
		};
	}

	console.log('Bad status from API', movieResponse.status);
	throw error(500, 'unable to retrieve movie details from API');
}

async function getMovieDetails(id: number) {
	return await fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}`);
}

async function getCredits(id: number) {
	return await fetch(`https://api.themoviedb.org/3/movie/${id}/credits?api_key=${TMDB_API_KEY}`);
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
		imdb_id: movie.imdb_id,
		vote_average: movie.vote_average,
		vote_count: movie.vote_count
	};
}
