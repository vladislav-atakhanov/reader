<script>

export let className
export let value

let width
let el, textValue

$: {
	if (el) {
		width = el?.offsetWidth
		const selected = el.querySelector(`[value="${value}"]`)
		textValue = selected ? selected.innerText : value
	}
}
</script>

<div class="wrapper">
	<select class="{className}" bind:this={el} bind:value={value}>
		<slot></slot>
	</select>
	<div class="select" style="width: {width}px">{textValue}</div>
</div>

<style>
.wrapper {
	position: relative;
}
select {
	box-sizing: content-box;
	padding: 0;
	padding-right: 20px;
	margin: 0;
	border: none;

	height: 2rem;
	opacity: 0;
}
.select {
	position: absolute;
	top: 0; left: 0;
	pointer-events: none;
	font-size: 13px;
	padding-left: 1rem;
	padding-right: 1rem;
	border-radius: 1rem;
	height: 2rem;
	line-height: 2rem;

	font-family: var(--font-family);
	font-weight: var(--font-weight);
	color: var(--text);

	background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 13 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8.07 10.5a2 2 0 01-3.47 0L.27 3A2 2 0 012 0h8.66a2 2 0 011.74 3l-4.33 7.5z' fill='%23654D33'/%3E%3C/svg%3E");
	background-repeat: no-repeat;
	background-position: right 1rem center;
	background-size: 13px 12px;
	background-color: var(--bg);
}
</style>