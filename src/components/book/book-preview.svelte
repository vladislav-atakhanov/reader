<script>
import { books, screen } from "../../store"

export let id

let book
let title, author, progress, cover

$: {
	book = $books.list[id]
	if (book && book.inited) {
		title = book.title
		author = book.author
		progress = book.progress * 100
		cover = book.cover
	}
}

const clickHandler = e => {
	screen.active = "book"
	books.active = id
	book.open()
}

</script>

{#if book && book.inited}
	<article class="book-preview {cover && 'book-preview--cover'}" data-book={id} on:click="{clickHandler}">
		<div class="book-preview__description">
			<h3 class="book-preview__title">{title}</h3>
			<p class="book-preview__author">{author}</p>
			<div class="book-preview__progress" style="--progress: {progress}%">
				{Math.floor(progress * 10) / 10}%
				<div class="progress__bar"></div>
			</div>
		</div>

		{#if cover}
			<img class="book-preview__cover" src="{cover}" alt="{title}">
		{/if}
	</article>
{/if}

<style>
.book-preview {
	position: relative;
	overflow: hidden;
	border-radius: 3rem;
	transition: .5s all;
	display: grid;
	width: 100%;
	max-width: 450px;
	--shadow-color: rgb(0 0 0 / .25);
	box-shadow: 0 .5rem 1rem 0 var(--shadow-color);
	padding: 1em;
}

.book-preview--cover {
	padding-right: 100px;
}
.book-preview:hover {
	--shadow-color: rgb(0 0 0 / .5);
}

.book-preview__description {
	display: grid;
	align-self: center;
	padding: 0 1em;
	order: -1;
}
.book-preview__cover {
	display: block;
	right: 0;
	height: 100%;
	max-width: 100px;
	object-fit: cover;
	position: absolute;
}
.book-preview__title,
.book-preview__author {
	margin: 0;
	padding: 0;
}
.book-preview__title {
	font-size: 18px;
	margin-bottom: 0.5rem;
	font-weight: bold;
}
.book-preview__author {
	font-size: 16px;
	margin-bottom: 2rem;
}

.book-preview__progress {
	text-align: right;
	color: var(--text);
}
.progress__bar {
	margin-top: 1rem;
	position: relative;
	width: 100%;
	background-color: var(--bg);
	height: 3px;
	border-radius: 1rem;
}
.progress__bar::before {
	content: "";
	border-radius: inherit;
	display: block;
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	width: var(--progress);
	background-color: var(--text);
}

</style>