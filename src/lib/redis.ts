import Redis from 'ioredis';

const connectionString = process.env['REDIS_CONNECTION'];

export const MOVIE_IDS_KEY = 'movie_ids';

/** Return the key used to store movie details for a given ID in Redis */
export function getMovieKey(id): string {
	return `movie:${id}`;
}

export default connectionString ? new Redis(connectionString) : new Redis();
