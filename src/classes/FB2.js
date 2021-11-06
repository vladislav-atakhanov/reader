import Book from "./Book.js"

const replaceTags = {
	v: "p",
	poem: "div",
	stanza: "div",
	emphasis: "em",
	description: "div",
	"empty-line": "br",
	epigraph: "div",
	"text-author": "p",
	cite: "div"
}

class FB2 extends Book {
	constructor(xml, id) {
		super(id)
		this.data = xml
		this.element = this.bookFromXML(xml)
		this.author = this._getAuthor()
		this.cover = this._getCover()
		this.title = this._getTitle()
	}

	bookFromXML(xml) {
		const el = document.createElement("div")
		el.innerHTML = xml
		el.innerHTML = el.querySelector("fictionbook").innerHTML
		el.className = "book__container"
		el.dataset.book = this.id
		this._headings(el)
		this._tags(el)
		return el
	}

	_getAuthor() {
		const author = this.element.querySelector("author")
		return Array.from(author.children).map(el => el.innerText).join(" ")
	}
	_getTitle() {
		return this.element.querySelector("book-title").innerText
	}
	_getCover() {
		const cover = this.element.querySelector('binary[id="cover.jpg"]')
		if (!cover)
			return null

		const _cover = `data:${cover.getAttribute("content-type")};base64,${cover.innerHTML}`
		cover.remove()
		return _cover
	}

	_headings(el) {
		el.querySelectorAll("title").forEach(title => {
			const tags = [
				"section"
			]
			const tagName = "h" + parseInt(tags.indexOf(
				title.parentElement.tagName.toLocaleLowerCase()
			) + 3)
			const heading = document.createElement(tagName)
			heading.innerHTML = title.innerText.trim()

			if (tagName == "h3")
				heading.innerHTML = heading.innerText.trim()
			else
				heading.innerHTML = heading.innerText

			title.replaceWith(heading)
		})

		this.chapters = el.querySelectorAll("h3")
	}
	_tags(el) {
		Object.entries(replaceTags).forEach(([tag, selector]) => {
			const selectorList = selector.split(".")
			el.querySelectorAll(tag).forEach(_el => {
				const element = document.createElement(selectorList[0])
				element.className = tag
				element.innerHTML = _el.innerHTML
				_el.replaceWith(element)
			})
		})
	}
}

export default FB2