export const MOVIE_IDS_KEY = 'movie_ids';
import Redis from 'ioredis';

const connectionString = process.env['REDIS_CONNECTION'];

export function getMovieKey(id): string {
	return `movie:${id}`;
}

export function initRedis(): Redis {
	return connectionString ? new Redis(connectionString) : new Redis();
}
