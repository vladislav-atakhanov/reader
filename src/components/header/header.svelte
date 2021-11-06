<script>
import LeftControll from "./left-controll.svelte"
import RightControll from "./right-controll.svelte"
import Setting from "../settings.svelte"
import Chapters from "../chapters.svelte"
</script>

<header class="header">
	<div class="header__controls"><LeftControll /></div>
	<div class="header__controls"><RightControll /></div>

	<div class="header__settings popup-wrapper">
		<Setting />
	</div>
	<div class="header__chapters popup-wrapper">
		<Chapters />
	</div>
</header>

<style>
.header {
	position: fixed;
	top: 0;
	width: 100%;
	left: 0;
	z-index: 5;
	padding-top: 1rem;
	padding-left: 1rem;
	padding-right: 1rem;
	display: flex;
	justify-content: space-between;
}
.header__controls {
	padding: 1rem 2rem;
	display: flex;
	gap: 4rem;
}

:global(.header__btn) {
	width: 2.5rem;
	height: 2.5rem;
}
</style>