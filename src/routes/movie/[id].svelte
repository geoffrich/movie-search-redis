<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async function ({ page, fetch }) {
		const { params } = page;
		const { id } = params;
		const result = await fetch(`/movie/${id}.json`);
		if (result.ok) {
			return {
				props: {
					movie: await result.json()
				},
				maxage: 300
			};
		}

		return {
			status: result.status,
			error: new Error('Could not retrieve id ' + id)
		};
	};
</script>

<script lang="ts">
	import type { Movie } from '$lib/types';
	import { getPosterUrl } from '$lib/image';
	import FallbackPoster from '$lib/FallbackPoster.svelte';
	import { parse, format } from 'date-fns';
	export let movie: Movie;

	$: director = movie.crew.find(
		(c) => c.role.localeCompare('director', undefined, { sensitivity: 'base' }) === 0
	);

	$: formattedDate = formatReleaseDate(movie.release_date);

	function formatReleaseDate(date) {
		if (date) {
			const parsed = parse(movie.release_date, 'yyyy-MM-dd', new Date());
			return format(parsed, 'MMM d, yyyy');
		}
		return undefined;
	}
</script>

<svelte:head>
	<title>{movie.title}</title>
</svelte:head>

<h1>{movie.title}</h1>

<div class="container">
	<div class="poster">
		{#if movie.poster_path}
			<img src={getPosterUrl(movie.poster_path, 'w342')} alt="{movie.title} poster" />
		{:else}
			<FallbackPoster />
		{/if}
	</div>
	<div>
		{#if movie.tagline}
			<p class="tagline">{movie.tagline}</p>
		{/if}
		<p>{movie.overview}</p>
		<dl>
			{#if formattedDate}
				<dt>Release date</dt>
				<dd>{formattedDate}</dd>
			{/if}
			{#if movie.runtime > 0}
				<dt>Runtime</dt>
				<dd>{movie.runtime} minutes</dd>
			{/if}
			{#if director}
				<dt>Director</dt>
				<dd>{director.name}</dd>
			{/if}
			{#if movie.genres.length > 0}
				<dt>Genres</dt>
				{#each movie.genres as genre}
					<dd>{genre}</dd>
				{/each}
			{/if}
			{#if movie.production_companies.length > 0}
				<dt>Production companies</dt>
				{#each movie.production_companies as company}
					<dd>{company}</dd>
				{/each}
			{/if}
			{#if movie.vote_count}
				<dt
					class="rating"
					class:low={movie.vote_average < 5}
					class:middle={movie.vote_average >= 5 && movie.vote_average < 8}
					class:high={movie.vote_average >= 8}
				>
					Rating
				</dt>
				<dd>{movie.vote_average} ({movie.vote_count} votes)</dd>
			{/if}
			{#if movie.budget > 0}
				<dt>Budget</dt>
				<dd>{movie.budget.toLocaleString()}</dd>
			{/if}
			<dt>Links</dt>
			{#if movie.imdb_id}
				<dd><a href="https://www.imdb.com/title/{movie.imdb_id}/">IMDB</a></dd>
			{/if}
			<dd><a href="https://www.themoviedb.org/movie/{movie.id}">TMDB</a></dd>
		</dl>
	</div>
</div>

<div class="credit-grid">
	<div>
		<h2>Cast</h2>
		{#if movie.cast.length > 0}
			<ul>
				{#each movie.cast as cast}
					<li><span class="bold">{cast.name}</span> {cast.role ? `as ${cast.role}` : ''}</li>
				{/each}
			</ul>
		{:else}
			<p>No data</p>
		{/if}
	</div>

	<div>
		<h2>Crew</h2>
		{#if movie.crew.length > 0}
			<ul>
				{#each movie.crew as crew}
					<li><span class="bold">{crew.name},</span> {crew.role}</li>
				{/each}
			</ul>
		{:else}
			<p>No data</p>
		{/if}
	</div>
</div>

<style>
	.tagline {
		font-style: italic;
	}

	.container {
		display: grid;
		gap: 1.5rem;
		grid-template-columns: 1fr;
	}

	@media screen and (min-width: 550px) {
		.container {
			grid-template-columns: 250px 1fr;
		}
	}

	.credit-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	}

	.poster {
		width: 100%;
		max-width: 250px;
		justify-self: center;
	}

	p {
		margin-top: 0;
	}

	dt {
		font-weight: 700;
	}

	dd {
		margin-left: 0.5rem;
	}

	dd + dt {
		margin-top: 0.5rem;
	}

	img {
		box-shadow: var(--shadow-med);
		width: 100%;
	}

	.rating.low {
		--rating-color: #dc2626;
	}

	.rating.middle {
		--rating-color: #fbbf24;
	}

	.rating.high {
		--rating-color: #059669;
	}

	.rating::after {
		content: '';
		width: 1rem;
		background-color: var(--rating-color);
		display: inline-block;
		height: 1rem;
		border-radius: 50%;
		vertical-align: middle;
		position: relative;
		left: 0.25rem;
	}
</style>
