import Store from "./Store"

const _default = `{
	"scheme": "sepia",
	"book-width": 544,
	"book-width-tmp": 544,
	"book-height-tmp": 4,
	"book-height": 4,
	"font-weight": 400,
	"font-family": "Roboto Slab",
	"font-size": 16
}`
const theme = localStorage.getItem("theme") || _default


class Theme extends Store {
	constructor() {
		super(JSON.parse(theme))
	}
	get(id) {
		return super.get()[id]
	}
	add(id, value) {
		super.add(id, value)
		document.body.style.setProperty(
			`--${id}`,
			typeof value == "string" ? `"${value}"` : value
		)
		localStorage.setItem("theme", JSON.stringify(super.get()))
	}
}

export default Theme