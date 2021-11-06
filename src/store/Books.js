import Store from "./Store"

let self
class Books extends Store {
	constructor() {
		super({
			listId: []
		})

		this._list = {}
		self = this

		this.set({
			list: Object.keys(this._list)
		})
	}

	addFiles(files) {
		for (const file of files) {
			const id = file.name
			if (!file.name.endsWith(".fb2")) {
				console.log(id + " not fictionbook");
				continue
			}

			const reader = new FileReader()

			reader.readAsText(file)
			reader.onload = e => {
				const data = reader.result
				this.add(id, {
					data, inited: false
				})
			}
		}
	}

	async update() {
		const text = await fetch("books.txt").then(data => data.text())
		const ArrayOfId = [...text.split("\n")].map(id => id.trim())

		ArrayOfId.forEach(async id => {
			const data = await fetch("books/"+id).then(data => data.text())
			self.add(id, {
				data, inited: false
			})
		})
	}

	get active() {
		return this._active
	}
	set active(value) {
		this._active = value
		super.add("active", value)
	}

	add(id, value) {
		this._list[id] = value
		super.add("list", this._list)
		super.add("listId", Object.keys(this._list))
	}
}

export default Books