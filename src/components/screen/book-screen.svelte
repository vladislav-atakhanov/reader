<script>
import Screen from "./screen.svelte"
import Book from "../book/book.svelte"

import { books } from "../../store"
let list = []
$: {
	if ($books.listId)
		list = $books.listId
}
</script>

<Screen name="book">
	{#each list as id (id)}
		<Book {id} />
	{/each}
</Screen>