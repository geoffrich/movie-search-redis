<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async function ({ page, fetch }) {
		const { query } = page;
		const searchQuery = query.get('query');
		const resultPage = query.get('page') ?? 1;
		const result = await fetch(`/search.json?query=${searchQuery}&page=${resultPage}`);
		if (result.ok) {
			const parsedResult = await result.json();
			return {
				props: {
					query: searchQuery,
					searchResponse: parsedResult
				},
				maxage: 300
			};
		}

		return {
			status: result.status,
			error: new Error('Could not perform search')
		};
	};
</script>

<script lang="ts">
	import type { Movie, SearchResponse } from '$lib/types/tmdb';
	import Search from '$lib/Search.svelte';

	export let query: string;
	export let searchResponse: SearchResponse;

	let movies: Movie[] = [];

	$: movies = searchResponse.results;
	$: ({ page: currentPage, total_pages: totalPages } = searchResponse);

	$: nextPage = currentPage < totalPages ? currentPage + 1 : null;
	$: previousPage = currentPage > 1 ? currentPage - 1 : null;
</script>

<svelte:head>
	<title>Search Results for "{query}"</title>
</svelte:head>

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
			<a href="/movie/{movie.id}">{movie.title}</a>
		</li>
	{:else}
		<p>No results.</p>
	{/each}
</ul>

<div class="links">
	{#if previousPage}
		<a href="/search?query={query}&page={previousPage}">Previous page</a>
	{/if}

	{#if nextPage}
		<a href="/search?query={query}&page={nextPage}">Next page</a>
	{/if}
</div>

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

	.links {
		display: flex;
		gap: 0.5rem;
	}
</style>
