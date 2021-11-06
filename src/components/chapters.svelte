<script>
import { books } from "../store"
let book
$: book = $books.list[$books.active]

function show() {
	book.showChapter(this)
	book.chapter = this
}

</script>


{#if book && book.inited && book.chapters.length}
<div class="chapters popup">
	<h2>{ book.title }</h2>
	<ul class="chapters__list">
	{#each book.chapters as chapter}
		<li class="chapters__item">
			<button class="chapters__btn"
					on:click={show.bind(chapter)}
			>{chapter.innerText}</button>
		</li>
	{/each}
	</ul>
</div>
{/if}


<style>
h2 {
	margin: 0;
}
.chapters__list {
	list-style: none;
	display: flex;
	flex-direction: column;
	gap: 1rem;
	margin: 0;
	height: 100%;
	width: 100%;
}
.chapters__btn {
	width: 100%;
	height: 100%;
	background-color: transparent;
	font: inherit;
	color: var(--text);
	border: none;
	text-align: left;
	cursor: pointer;
	font-weight: bold;
}
.chapters__btn::before {
	content: "Глава ";
	font-weight: normal;
}
.chapters__btn:hover {
	text-decoration: underline;
}
</style>