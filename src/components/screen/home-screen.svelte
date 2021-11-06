<script>
import Screen from "./screen.svelte"
import BookList from "../book/book-list.svelte"
import BookSelect from "../book/book-select.svelte"
import Dropper from "../dropper.svelte"
import { books } from "../../store"

function dragover() {
	document.body.classList.add("drag--active")
}

function dragleave() {
	document.body.classList.remove("drag--active")
}
function drop(e) {
	document.body.classList.remove("drag--active")
	books.addFiles(e.dataTransfer.files)
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