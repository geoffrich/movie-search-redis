<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async function ({ page, fetch }) {
		const { query } = page;
		const searchQuery = query.get('query');
		const result = await fetch(`/search.json?query=${searchQuery}`);
		if (result.ok) {
			return {
				props: {
					query: searchQuery,
					movies: await result.json()
				}
			};
		}

		return {
			status: result.status,
			error: new Error('Could not perform search')
		};
	};
</script>

<script lang="ts">
	import type { Movie } from '$lib/types/tmdb';
	import Search from '$lib/Search.svelte';

	export let query: string;
	export let movies: Movie[];
</script>

<h1>Search Results</h1>

<Search {query} />
<ul>
	{#each movies as movie (movie.id)}
		<li>
			<!-- TODO: get from config endpoint -->
			<!-- TODO: handle no poster -->
			{#if movie.poster_path}
				<img src="https://image.tmdb.org/t/p/w154{movie.poster_path}" alt="{movie.title} poster" />
			{/if}
			<span>{movie.title}</span>
		</li>
	{/each}
</ul>

<style>
	ul {
		display: grid;
		list-style: none;
		padding: 0;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 0.5rem;
	}

	img {
		width: 100%;
	}
</style>
