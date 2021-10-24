<script lang="ts">
	import '../app.css';
</script>

<div class="container">
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
</style>
