<script>
import BackBtn from "../buttons/back-btn.svelte"
import SettingsBtn from "../buttons/settings-btn.svelte"
import ChaptersBtn from "../buttons/chapters-btn.svelte"
import AddBtn from "../buttons/add-btn.svelte"

import { screen, books } from "../../store"
let book, chapters = []

$: {
	book = $books.list[$books.active]
	if (book && book.chapters)
		chapters = book.chapters
}

</script>

<BackBtn class="header__btn" />
<SettingsBtn class="header__btn" />

{#if $screen.active == "book" && chapters.length}
	<ChaptersBtn class="header__btn" />
{/if}

{#if $screen.active == "home"}
	<AddBtn class="header__btn" />
{/if}