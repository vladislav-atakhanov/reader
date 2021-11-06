<script>
let className
export { className as class }
</script>

<button class="btn btn--folder {className}" on:click="{() => fetch("$folder")}">
	<svg viewBox="0 0 17 13" width="17"><path d="M15.5 1.7H8.6L7.2.1 7.1 0H1.5C.7 0 0 .7 0 1.5v10c0 .8.7 1.5 1.5 1.5h14c.8 0 1.5-.7 1.5-1.5V3.2c0-.8-.7-1.5-1.5-1.5z"/></svg>
</button>