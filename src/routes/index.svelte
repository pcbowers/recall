<script lang="ts">
	let theme = 'dark';
	let hover = false;
	const toggleTheme = () => {
		theme = theme === 'dark' ? 'light' : 'dark';
		document.documentElement.dataset.theme = theme;
	};
</script>

<div class="prose">
	<h1>Welcome to SvelteKit</h1>

	<button class="btn btn-primary" on:click={toggleTheme}>Primary</button>
	<button class="btn btn-secondary" on:click={toggleTheme}>Secondary</button>
	<button class="btn btn-accent" on:click={toggleTheme}>Accent</button>
	<br />
	<br />
	<button class="btn btn-info" on:click={toggleTheme}>Info</button>
	<button class="btn btn-warning" on:click={toggleTheme}>Warning</button>
	<button class="btn btn-error" on:click={toggleTheme}>Error</button>
	<button class="btn btn-success" on:click={toggleTheme}>Success</button>
	<br />
	<br />
	<div
		class="bg-neutral text-neutral-content w-40 h-10"
		class:bg-neutral-focus={hover}
		on:mouseenter={() => (hover = true)}
		on:mouseleave={() => (hover = false)}
	>
		neutral
	</div>
	<div class="bg-base-100 text-base-content w-40 h-10">base 100</div>
	<div class="bg-base-200 text-base-content w-40 h-10">base 200</div>
	<div class="bg-base-300 text-base-content w-40 h-10">base 300</div>
</div>
