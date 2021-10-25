<div class="no-movie">
	<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
		/>
	</svg>
</div>

<style>
	.no-movie {
		box-shadow: var(--shadow-med);
	}

	.no-movie {
		color: var(--primary-color);
		display: grid;
		place-items: center;
		border: 1px solid var(--secondary-color);
		aspect-ratio: 2 / 3;
	}

	svg {
		height: 3rem;
		width: 3rem;
	}

	@supports not (aspect-ratio: 2 / 3) {
		.no-movie {
			padding-top: 150%;
			position: relative;
		}

		svg {
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
		}
	}
</style>
