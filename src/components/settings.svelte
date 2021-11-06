<script>
import { theme } from "../store"

import Range from "./inputs/range.svelte"
import Radio from "./inputs/radio.svelte"
import Select from "./inputs/select.svelte"
import ActiveBook from "./book/active-book.svelte"

let scheme = theme.get("scheme"),
	_width = theme.get("book-width-tmp"),
	width = theme.get("book-width"),

	_height = theme.get("book-height-tmp"),
	height = theme.get("book-height"),

	fontWeight = theme.get("font-weight"),
	fontFamily = theme.get("font-family"),
	fontSize = theme.get("font-size")

$: theme.add("scheme", scheme)
$: theme.add("book-width", width)
$: theme.add("book-width-tmp", _width)

$: theme.add("book-height-tmp", _height)
$: theme.add("book-height", height)

$: theme.add("font-weight", fontWeight)
$: theme.add("font-family", fontFamily)
$: theme.add("font-size", fontSize)

const change = event => {
	const e = event.detail
	document.body.classList.remove("size-changing")
}
const input = event => {
	const e = event.detail
	document.body.classList.add("size-changing")
}

</script>
<div class="settings popup">

	<ActiveBook />

	<div class="settings__field">
		<h3 class="setting__title">Размер текста <span>{_width}x{_height*2}</span></h3>
		<Range className="width__input"
			   min="100"
			   max="{window.innerWidth - 20}"
			   bind:value="{width}"
			   bind:_value="{_width}"

			   on:change="{change}"

			   on:input="{input}"/>
		<Range className="width__input"
			   min="2"
			   max="{
				   Math.floor(window.innerHeight / (fontSize * 2 * 1.25))
			   }"
			   bind:value="{height}"
			   bind:_value="{_height}"

			   on:change="{change}"
			   on:input="{input}"/>
	</div>

	<div class="settings__field settings__field--select">
		<h3 class="setting__title">Цветовая<br>схема</h3>
		<Select className="scheme__input" bind:value="{scheme}">
			<option value="sepia">Сепия</option>
			<option value="sepia-contrast">Сепия контарст</option>
			<option value="day">День</option>
			<option value="night">Ночь</option>
			<option value="night-contrast">Ночь контарст</option>
			<option value="dusk">Сумерки</option>
			<option value="console">Консоль</option>
		</Select>
	</div>

	<div class="settings__field settings__field--select">
		<h3 class="setting__title">Шрифт</h3>
		<Select className="font__input" bind:value="{fontFamily}">
			<option value="RobotoSlab">Roboto Slab</option>
			<option value="Jura">Jura</option>
			<option value="PlayfairDisplay">Playfair Display</option>
			<option value="Raleway">Raleway</option>
		</Select>
	</div>

	<div class="settings__field">
		<h3 class="setting__title" style="font-weight: {fontWeight};">Жирность <span>{fontWeight}</span></h3>
		<fieldset class="settings__fieldset" style="font-family: var(--font-family);">
			{#each [300, 400, 600, 700] as weight }
				<Radio bind:group="{fontWeight}" value="{weight}" label="А" style="font-weight: {weight};" />
			{/each }
		</fieldset>
	</div>
	<div class="settings__field">
		<h3 class="setting__title">Кегль <span>{fontSize}</span></h3>
		<Range className="font-size__input" min="12" max="30" bind:value="{fontSize}" />
	</div>
</div>

<style>
.settings__field--select {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 3rem;
}
.setting__title span {
	float: right;
}
.settings__field .setting__title {
	margin: 0;
	font-size: 14px;
	font-weight: normal;
}
.settings__fieldset {
	display: flex;
	margin: 0;
	padding: 0;
	border: none;
	gap: 1em;
	justify-content: space-between;
}
</style>