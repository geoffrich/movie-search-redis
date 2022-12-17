import Redis from 'ioredis';
import { REDIS_CONNECTION } from '$env/static/private';

export const MOVIE_IDS_KEY = 'movie_ids';

/** Return the key used to store movie details for a given ID in Redis */
export function getMovieKey(id: number): string {
	return `movie:${id}`;
}

export default REDIS_CONNECTION ? new Redis(REDIS_CONNECTION) : new Redis();
