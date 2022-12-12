<script lang="ts">
	export let query: string | null = null;
</script>

<form action="/search">
	<label for="search">Search</label>
	<div class="container">
		<input type="text" id="search" name="query" value={query} />
		<button>Go</button>
	</div>
</form>

<style>
	.container {
		display: grid;
		grid-template-columns: 1fr 4rem;
	}

	input {
		font-size: 1.5rem;
		padding: 0.5em;
		border-radius: 8px 0 0 8px;
		border: 1px solid var(--secondary-color);
	}

	button {
		height: 3.5rem;
		width: 100%;
		border-radius: 0 8px 8px 0;
		border: 1px solid var(--secondary-color);
		background-color: var(--tertiary-color);
	}

	label {
		display: block;
		margin-bottom: 0.25rem;
	}

	:focus {
		outline-offset: -2px;
	}
</style>
