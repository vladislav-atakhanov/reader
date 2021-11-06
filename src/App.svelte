<script>
import { theme } from "./store"

import Header from "./components/header/header.svelte"
import BookScreen from "./components/screen/book-screen.svelte"
import HomeScreen from "./components/screen/home-screen.svelte"

</script>

<main class="theme--{$theme.scheme}">
	<Header />

	<HomeScreen />
	<BookScreen />
</main>

<style>
:global(main) {
	height: 100%;
	--popup-bg: var(--bg);
	--element-text: var(--text);
	--element-bg: var(--bg);

	background-color: var(--bg);
	color: var(--text);
}
</style>