<script lang="ts">
	import '../app.css';
</script>

<div class="container">
	<header>
		<nav>
			<a href="/">Search</a>
			<a href="/movie/random">Random</a>
		</nav>
	</header>
	<main>
		<slot />
	</main>
	<footer>
		<p>
			This product uses the <a href="https://www.themoviedb.org/">TMDB</a> API but is not endorsed or
			certified by TMDB.
		</p>
	</footer>
</div>

<style>
	.container {
		padding: 1rem;
		width: 100%;
		max-width: 1024px;
		margin: 0 auto;
	}
	main {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	nav {
		display: flex;
		gap: 1rem;
	}
</style>
