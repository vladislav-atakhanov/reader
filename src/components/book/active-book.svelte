<script>
import { books, screen } from "../../store"
let book, documentTitle

$: {
	book = $books.list[$books.active]
	if ($screen.active == "book")
		documentTitle = `${book.title} - Reader`
	else
		documentTitle = "Reader"
}

</script>

<svelte:head>
	<title>{documentTitle}</title>
</svelte:head>
{#if $screen.active == "book" && book && book.inited}
	<div class="book">
		<p class="book__title">{book.title}</p>
		<p class="book__author">{book.author}</p>

		{#if book.chapter}
			<p class="book__chapter">{@html book.chapter.innerHTML}</p>
		{/if}
		<p class="book__progress">{
			Math.floor(book.progress * 1000) / 10
		}%</p>
	</div>
{/if}

<style>
.book {
	display: grid;
	grid-template-columns: 1fr 1fr;
	background-color: var(--bg);
	padding: 1rem;
	border-radius: 1rem;
	justify-content: space-between;
	font-size: 14px;
}
.book__title, .book__author {
	grid-column: 1 / -1;
}
.book__title {
	font-weight: bold;
}
.book__progress {
	grid-column: 2 / -1;
	text-align: right;
}
.book p {
	margin: 0;
}
</style>