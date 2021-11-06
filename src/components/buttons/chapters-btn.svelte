<script>
let className
export { className as class }

const mouseover = () => {
	document.querySelector(".header__chapters").classList.add("popup-wrapper--active")
}
const mouseout = () => {
	document.querySelector(".header__chapters").classList.remove("popup-wrapper--active")
}
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<button class="btn btn--chapters {className}"
		on:mouseout={mouseout}
		on:mouseover={mouseover}>
		<svg viewBox="0 0 19 13" width="18" fill="currentColor">
			<path d="M4 1a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V1ZM4 6a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6ZM4 11a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-1ZM3 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM3 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM3 11.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z"/>
		</svg>
</button>