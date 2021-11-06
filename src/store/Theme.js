import Store from "./Store"

const width = Math.min(Math.floor(innerWidth * .9), 544)

const _default = `{
	"scheme": "sepia",
	"book-width": ${width},
	"book-width-tmp": ${width},
	"book-height-tmp": 4,
	"book-height": 4,
	"font-weight": 400,
	"font-family": "RobotoSlab",
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