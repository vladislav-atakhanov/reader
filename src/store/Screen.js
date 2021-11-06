import Store from "./Store"

let self
class Screen extends Store {
	constructor() {
		super({})
		this.active = "home"
		this.prevent = "home"
		self = this
	}

	set active(value) {
		this._active = value
		this.add("active", value)
	}
	get active() {
		return this._active
	}

	get prevent() {
		return this._prevent
	}
	set prevent(value) {
		this._prevent = value
		this.add("prevent", value)
	}

	toPrevent() {
		[self.active, self.prevent] = [self.prevent, self.active]
		if (self.active == self.prevent && self.active == "book")
			self.active = "home"
	}
}

export default Screen