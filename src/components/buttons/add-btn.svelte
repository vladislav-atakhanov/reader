<script>
import { books } from "../../store"

let className
export { className as class }

async function submit(e) {

	for (const file of e.target.files) {
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

<label class="add-book">
	<input type="file" on:input="{submit}" multiple accept=".fb2">
	<span class="btn btn--add {className}">
		+
	</span>
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