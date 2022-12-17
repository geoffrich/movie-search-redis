import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import redis, { MOVIE_IDS_KEY } from '$lib/redis';

export const load: PageServerLoad = async function () {
	const randomId = await redis.srandmember(MOVIE_IDS_KEY);
	throw redirect(303, `/movie/${randomId}`);
};
