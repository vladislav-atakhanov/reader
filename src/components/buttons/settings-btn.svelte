<script>
let className
export { className as class }

const mouseover = () => {
	document.querySelector(".header__settings").classList.add("popup-wrapper--active")
}
const mouseout = () => {
	document.querySelector(".header__settings").classList.remove("popup-wrapper--active")
}
</script>

<!-- svelte-ignore a11y-mouse-events-have-key-events -->
<button class="btn btn--settings {className}"
		on:mouseout={mouseout}
		on:mouseover={mouseover}>
	<svg viewBox="0 0 16 16"  width="16">
		<path d="M13.3 8.5V7l1.6-1.2c.1-.2.2-.3 0-.5l-1.4-2.6c-.1-.2-.3-.2-.5-.2l-1.9.8-1.2-.8-.3-2a.4.4 0 00-.4-.2h-3a.4.4 0 00-.4.3l-.2 2a6 6 0 00-1.3.7l-1.9-.8a.4.4 0 00-.4.2L.5 5.3a.4.4 0 000 .5L2.2 7v1.5L.6 9.7a.4.4 0 000 .5L2 12.8c0 .2.3.2.5.2l1.8-.8 1.3.8.3 2 .4.2h3c.1 0 .3-.1.3-.3l.3-2c.5-.1.9-.4 1.3-.7l1.8.8c.2 0 .4 0 .5-.2l1.5-2.6v-.5l-1.7-1.2zm-5.6 1.9a2.6 2.6 0 110-5.3 2.6 2.6 0 010 5.3z"/>
	</svg>
</button>