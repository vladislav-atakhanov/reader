<script>
import { books } from "../../store";

function submit(files) {
	for (const file of files) {
		const reader = new FileReader()
		const id = file.name

		reader.readAsText(file)
		reader.onload = e => {
			const data = reader.result

			books.add(id, {
				data, inited: false
			})
		}
	}
}

</script>


<div class="wrapper">
	<label
	class="drag"
	>
		<h1 class="drag__title">Выберите файлы</h1>
		<input type="file" on:input={e => submit(e.target.files)} multiple class="drag__input">
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
	padding: 5em;
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