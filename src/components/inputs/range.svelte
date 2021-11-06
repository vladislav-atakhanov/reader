<script>
import { createEventDispatcher } from 'svelte'

export let className
export let min = 0
export let max = 100

export let value
export let _value

let _valueUnsetted = !_value
if (_valueUnsetted)
	_value = value

const dispatch = createEventDispatcher()

const change = e => {
	value = _value
	dispatch("change", e)
}
const input = e => {

	if (_valueUnsetted)
		value = _value

	dispatch("input", e)
}

let percent = 0
$: percent = (_value - min) / (max - min) * 100
</script>

<div class="wrapper {className}">
	<input type="range"
		   {min} {max}
		   bind:value={_value}
		   on:change={change}
		   on:input={input}
		   on:pointerup={change}>
	<div class="range" style="--percent: {percent}%">
		<div class="range__track"></div>
		<div class="range__thumb"></div>
	</div>
</div>

<style>
.wrapper {
	position: relative;
}
input[type=range] {
	-webkit-appearance: none;
	width: 100%;
	height: 2rem;
	margin: 0;
	padding: 0;
	display: block;
	opacity: 0;
	cursor: pointer;
}
.range {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;

	height: 2rem;
	padding: .5rem 0;
	pointer-events: none;
}
.range__track {
	background-color: var(--bg);
	height: 1rem;
	border-radius: 1rem;
	position: relative;
	overflow: hidden;
}
.range__thumb {
	height: 2rem;
	width: calc(100% - 2rem);
	position: absolute;
	top: 0;
	margin: 0 1rem;
	background-color: transparent;
	--color: var(--text)
}
.range__thumb::before {
	content: "";
	position: absolute;
	background-color: var(--color);
	width: 2rem;
	height: 2rem;
	top: 50%;
	margin-left: -1rem;
	margin-top: -1rem;
	left: var(--percent);
	border-radius: 1em;
}
.range__thumb::after {
	content: "";
	width: calc(var(--percent) + 1rem);
	margin-left: -1rem;
	margin-top: .5rem;
	height: 1rem;
	display: block;
	background-color: var(--color);
	border-radius: 1rem;
}
</style>