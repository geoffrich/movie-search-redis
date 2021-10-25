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
	export let movie: Movie;
</script>

<svelte:head>
	<title>{movie.title}</title>
</svelte:head>

<h1>{movie.title}</h1>
{#if movie.tagline}
	<p class="tagline">{movie.tagline}</p>
{/if}
<div class="container">
	<img src={getPosterUrl(movie.poster_path, 'w342')} alt="{movie.title} poster" />
	<div>
		<p>{movie.overview}</p>
		<dl>
			{#if movie.genres.length > 0}
				<dt>Genres</dt>
				{#each movie.genres as genre}
					<dd>{genre}</dd>
				{/each}
			{/if}
			<dt>Release date</dt>
			<dd>{movie.release_date}</dd>
			<dt>Runtime</dt>
			<dd>{movie.runtime} minutes</dd>
			{#if movie.production_companies.length > 0}
				<dt>Production companies</dt>
				{#each movie.production_companies as company}
					<dd>{company}</dd>
				{/each}
			{/if}
			{#if movie.budget > 0}
				<dt>Budget</dt>
				<dd>{movie.budget.toLocaleString()}</dd>
			{/if}
		</dl>
	</div>
</div>

<h2>Cast</h2>
<ul>
	{#each movie.cast as cast}
		<li><b>{cast.name}</b> as {cast.role}</li>
	{/each}
</ul>

<h2>Crew</h2>
<ul>
	{#each movie.crew as crew}
		<li><b>{crew.name},</b> {crew.role}</li>
	{/each}
</ul>

<style>
	.tagline {
		font-style: italic;
		text-align: center;
	}

	.container {
		display: grid;
		gap: 1rem;
		grid-template-columns: 1fr;
	}

	@media screen and (min-width: 550px) {
		.container {
			grid-template-columns: 250px 1fr;
		}
	}

	img {
		width: 100%;
		max-width: 250px;
		justify-self: center;
	}

	p {
		margin-top: 0;
	}

	li + li {
		margin-top: 0.25rem;
	}
</style>
