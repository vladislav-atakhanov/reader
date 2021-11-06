<script>
import { books } from "../../store"

let className
export { className as class }
</script>

<label class="add-book btn btn--add {className}">
	<input type="file" on:input="{e => books.addFiles(e.target.files)}" multiple accept=".fb2">
	<svg width="14" viewBox="0 0 14 14">
		<path d="M13 7H1m6-6v12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
	  </svg>
</label>

<style>
.btn--add {
	border-radius: 0
}
.add-book {
	border-radius: .5rem;
	display: flex;
	overflow: hidden;
}
.add-book:focus-within {
	box-shadow: 0 0 0 1px var(--text);
}
input {
	position: absolute;
	width: 1px;
	height: 1px;
	overflow: hidden;
	opacity: 0;
}
</style>