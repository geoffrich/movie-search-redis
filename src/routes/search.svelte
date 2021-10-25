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
	import { getPosterUrl } from '$lib/image';
	import Search from '$lib/Search.svelte';
	import FallbackPoster from '$lib/FallbackPoster.svelte';

	export let query: string;
	export let searchResponse: SearchResponse;

	let movies: Movie[] = [];

	$: movies = searchResponse.results;
	$: ({ page: currentPage, total_pages: totalPages } = searchResponse);

	$: nextPage = currentPage < totalPages ? currentPage + 1 : null;
	$: previousPage = currentPage > 1 ? currentPage - 1 : null;

	function getReleaseYear({ release_date }: Movie) {
		if (release_date) {
			return `(${release_date.split('-')[0]})`;
		}
		return '';
	}
</script>

<svelte:head>
	<title>Search Results for "{query}" - Page {currentPage}</title>
</svelte:head>

<h1>Search Results</h1>

<Search {query} />
<p>{searchResponse.total_results} results (page {currentPage} of {totalPages})</p>
<ul>
	{#each movies as movie (movie.id)}
		<li>
			<!-- TODO: get path from config endpoint -->
			{#if movie.poster_path}
				<img
					src={getPosterUrl(movie.poster_path, 'w185')}
					height="258"
					width="158"
					alt="{movie.title} poster"
				/>
			{:else}
				<FallbackPoster />
			{/if}
			<a href="/movie/{movie.id}">{movie.title} {getReleaseYear(movie)}</a>
		</li>
	{:else}
		<p>No results.</p>
	{/each}
</ul>

<div class="links">
	{#if previousPage}
		<a href="/search?query={query}&page={previousPage}" sveltekit:prefetch>Previous page</a>
	{/if}

	{#if nextPage}
		<a href="/search?query={query}&page={nextPage}" sveltekit:prefetch>Next page</a>
	{/if}
</div>

<style>
	ul {
		display: grid;
		list-style: none;
		padding: 0;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 1rem;
		margin: 1rem 0;
	}

	li {
		display: grid;
		gap: 0.5rem;
	}

	.links {
		display: flex;
		gap: 1rem;
	}

	img {
		box-shadow: var(--shadow-med);
		height: auto;
	}
</style>
