<script>
import BookPreview from "./book-preview.svelte"
export let list
</script>
<ul class="book-list">
	{#each list as id (id)}
		<li class="book-list__item"><BookPreview {id}/></li>
	{/each}
</ul>

<style>
.book-list {
	margin: 0 auto;
	width: 100%;
	max-height: 100%;
	padding: 0 1em;
	padding-bottom: 5em;
	overflow-y: auto;
	overflow-x: visible;
	list-style: none;
}
:global(.book-preview) {
	margin-left: auto;
	margin-right: auto;
}
@media (max-width: 1099px) {
	.book-list__item + .book-list__item {
		margin-top: 2em;
	}
}
@media (min-width: 1100px) {
	.book-list {
		display: grid;
		grid-template-columns: 450px 450px;
		gap: 2em;
		align-items: center;
		justify-content: center;
	}
}
.book-list::-webkit-scrollbar {
	width: 0;
}
@media (min-width: 900px) {
	.book-list {
		--columns: 2;
	}
}
</style>