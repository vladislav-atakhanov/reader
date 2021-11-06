class Book {
	constructor(id) {
		this.id = id

		this.chapters = []
		this.progress = this._getFromLocalStorage().progress || 0
	}

	open() {
		setTimeout(() => {
			const element = this.element.parentNode
			element.scrollTop = this.progress * this.element.offsetHeight
		}, 1)
	}

	_getFromLocalStorage() {
		const localBooks = localStorage.getItem("books") ?? "{}"
		const books = JSON.parse(localBooks)
		if (!books[this.id])
			books[this.id] = {}
		return books[this.id]
	}
	_saveToLocalStorage(book) {
		const localBooks = localStorage.getItem("books") ?? "{}"
		const books = JSON.parse(localBooks)
		books[this.id] = book
		const jsonBooks = JSON.stringify(books)
		localStorage.setItem("books", jsonBooks)
	}

	scrollToChapter(chapter) {}

	_curentChapter(top) {
		let chapter
		for (const i in this.chapters) {
			const h3 = this.chapters[i]
			if (h3.offsetTop > top) {
				if (i == 0)
					chapter = this.chapters[0]
				else
					chapter = this.chapters[i - 1]
				break
			}
		}

		this.chapter = chapter || this.chapters[this.chapters.length - 1]
	}

	setProgress(top, height) {
		this.progress = top / height

		if (!this.chapters.length)
			return

		this._curentChapter(top)
	}

	set progress(value) {
		this._progress = value
		const book = this._getFromLocalStorage()
		book.progress = value
		this._saveToLocalStorage(book)
	}
	get progress() {
		return this._progress
	}
}

export default Book