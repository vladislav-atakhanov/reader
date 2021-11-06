<script>
import Screen from "./screen.svelte"
import BookList from "../book/book-list.svelte"
import BookSelect from "../book/book-select.svelte"
import Dropper from "../dropper.svelte"
import { books } from "../../store"

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

function dragover() {
	document.body.classList.add("drag--active")
}

function dragleave() {
	document.body.classList.remove("drag--active")
}
function drop(e) {
	document.body.classList.remove("drag--active")
	submit(e.dataTransfer.files)
}


</script>

<svelte:body
	on:dragover|preventDefault={dragover}
	on:dragleave|preventDefault={dragleave}
	on:drop|preventDefault={drop}
/>

<Screen name="home">
	{#if $books.listId}
		<BookList list={$books.listId} />
		<Dropper />
	{:else}
		<BookSelect />
	{/if}
</Screen>

<style>
:global(.screen--home) {
	padding-top: 10rem;
}
</style>