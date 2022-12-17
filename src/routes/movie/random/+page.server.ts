import { redirect, type ServerLoad } from '@sveltejs/kit';
import redis, { MOVIE_IDS_KEY } from '$lib/redis';

export const load: ServerLoad = async function () {
	const randomId = await redis.srandmember(MOVIE_IDS_KEY);
	throw redirect(303, `/movie/${randomId}`);
};
