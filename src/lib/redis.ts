export const MOVIE_IDS_KEY = 'movieids';

export function getMovieKey(id): string {
	return `movie:${id}`;
}
