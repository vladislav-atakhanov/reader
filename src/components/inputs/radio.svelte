<script>
export let group
export let value
export let label
export let style

</script>


<label class="radio" {style}>
	<input type="radio" bind:group="{group}" {value} class="radio__input">
	<div class="radio__label">{ label }</div>
</label>

<style>
.radio {
	line-height: 1;
	margin: 0;
	position: relative;
	text-align: center;
}
.radio__input:checked ~ .radio__label {
	background-color: var(--bg);
}
.radio__label {
	padding: 0.5rem;
	border-radius: 0.5rem;
	width: 100%;
	transition: all .25s;
}
.radio__input {
	opacity: 0;
	width: 1px;
	height: 1px;
	overflow: hidden;
	position: absolute;
	margin: 0;
}
</style>