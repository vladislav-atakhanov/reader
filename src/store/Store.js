import { writable } from "svelte/store"

class Store {
	constructor(value) {
		this.writable = writable(value)

		this.subscribe = this.writable.subscribe
		this.set = this.writable.set
	}
	add(id, value) {
		this.writable.update($store => {
			$store[id] = value
			return $store
		})
	}
	get() {
		let store
		this.writable.update($store => {
			store = $store
			return $store
		})
		return store
	}
}

export default Store