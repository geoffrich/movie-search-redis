import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param) => {
	const id = parseInt(param);
	return !isNaN(id);
};
