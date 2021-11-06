<script>
import { books, theme } from "../../store"
import FB2 from "../../classes/FB2"

export let id

let book, _book, element


let lineHeight = 1.25

$: {
	_book = $books.list[id]
	if (_book && element && !_book.inited) {
		book = new FB2(_book.data, id)
		book.showChapter = showChapter
		book.inited = true
		books.add(id, book)
		element.appendChild(book.element)
		book.open()
	}
}
const showChapter = chapter => {
	const offsetTop = window.innerHeight - $theme["book-height"] * 2 * $theme["font-size"] * lineHeight
	element.scrollTop = chapter.offsetTop - offsetTop / 2
}
function scroll() {
	book.setProgress(element.scrollTop, element.scrollHeight)
	books.add(id, book)
}

</script>

<article class="book { $books.active == id ? "book--active" : ""}"
		 bind:this={element}
		 on:scroll={scroll}
		 style="--line-height: {lineHeight};"
	>

	<div class="book__page"></div>
	<div class="book__border book__border--top"></div>
	<div class="book__border book__border--bottom"></div>

</article>

<style >
.book {
	font-weight: var(--font-weight);
	font-family: var(--font-family);
	font-size: calc(var(--font-size) * 1px);
	width: 100%;

	pointer-events: none;
	opacity: 0;
	position: absolute;

	height: 100%;
	line-height: var(--line-height);

	--height: calc(2em * var(--line-height) * var(--book-height));
	--width: calc(var(--book-width, 800) * 1px);

	--tmp-width: calc(var(--book-width-tmp, 800) * 1px);
	--tmp-height: calc(2em * var(--line-height) * var(--book-height-tmp));


	--border: calc(50vh - var(--height)/2);
	--border-top: var(--border);
	--border-bottom: var(--border);

	padding-top: var(--border-top);
	padding-bottom: var(--border-bottom);

	overflow-y: auto;
	scroll-snap-type: y proximity;
}

:global(.size-changing .book__container) {
	opacity: 0;
	display: none;
}
:global(.book__container) {
	width: var(--width);
	margin: 0 auto;
	overflow: hidden;
}

.book::-webkit-scrollbar {
	width: 0;
}
.book__border {
	z-index: 1;
	position: fixed;
	left: 0; right: 0;
	background-color: var(--bg);
	pointer-events: none;
}
.book__border--bottom {
	height: var(--border-bottom);
	bottom: 0;
}
.book__border--top {
	height: var(--border-top);
	top: 0;
}
.book__page {
	--opacity: .5;
	opacity: 0;
	pointer-events: none;
	position: fixed;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	width: var(--tmp-width);
	height: var(--tmp-height);
	background-color: var(--text);
	z-index: 2;
}

:global(.size-changing) .book__page {
	opacity: var(--opacity, 1);
}
:global(.screen--active) .book--active {
	pointer-events: all;
	opacity: 1;
	position: relative;
}
</style>