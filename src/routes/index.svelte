<script context="module">
	export const prerender = true;
</script>

<script lang="ts">
	import Search from '$lib/Search.svelte';
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

<h1>Search Movies</h1>

<Search />

<p>Credit TMDB</p>
