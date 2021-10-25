<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async function ({ fetch }) {
		const result = await fetch(`/movie/random.json`);
		if (result.ok) {
			const id = await result.json();
			return {
				redirect: `/movie/${id}`,
				status: 303
			};
		}

		return {
			status: result.status,
			error: new Error('Could not retrieve random id')
		};
	};
</script>
