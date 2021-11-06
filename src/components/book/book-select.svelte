<script>
import { books } from "../../store";
</script>


<div class="wrapper">
	<label
	class="drag"
	>
		<h1 class="drag__title">Выберите файлы</h1>
		<input
			type="file"
			class="drag__input"
			accept=".fb2"
			multiple
			on:input={e => books.addFiles(e.target.files)}
		>
	</label>
</div>

<style>
.wrapper {
	display: flex;
	align-items: center;
	justify-content: center;
	height: calc(100% - 100px);
}
.drag__input {
	position: absolute;
	pointer-events: none;
	opacity: 0;
}
.drag {
	cursor: pointer;
	width: 90%;
	max-width: 448px;
	display: flex;
	align-items: center;
	justify-content: center;
	text-align: center;
	padding: 2em 0;
	border-style: dashed;
	border-color: var(--text);
	border-width: 3px;
	border-radius: 1em;
	transition: all .5s;
}
:global(.drag--active) .drag {
	border-style: solid;
}
.drag__title {
	margin: 0;
}
</style>