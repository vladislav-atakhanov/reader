<script>
import BookPreview from "./book-preview.svelte"
export let list
</script>
<ul class="book-list">
	{#each list as id (id)}
		<li><BookPreview {id}/></li>
	{/each}
</ul>

<style>
.book-list {
	padding: 0;
	margin: 0 auto;
	width: calc(100% - 2em);
	max-width: 900px;
	list-style: none;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-gap: 4em;
	--height: 15rem;
}
</style>