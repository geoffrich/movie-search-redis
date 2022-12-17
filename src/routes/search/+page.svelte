<script lang="ts">
	import type { Movie, SearchResponse } from '$lib/types/tmdb';
	import { getPosterUrl } from '$lib/image';
	import Search from '$lib/Search.svelte';
	import FallbackPoster from '$lib/FallbackPoster.svelte';
	import type { PageData } from './$types';
	import { page } from '$app/stores';

	export let data: PageData;

	let movies: Movie[] = [];

	$: query = $page.url.searchParams.get('query');

	$: movies = data.searchResponse.results;
	$: ({ page: currentPage, total_pages: totalPages } = data.searchResponse);

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
<p>{data.searchResponse.total_results} results (page {currentPage} of {totalPages})</p>
<ul>
	{#each movies as movie (movie.id)}
		<li>
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
		gap: 1rem;
		margin: 1rem 0;
	}

	li {
		grid-row: span 2;
		display: grid;
		gap: 0.5rem;
		grid-template-rows: subgrid;
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
