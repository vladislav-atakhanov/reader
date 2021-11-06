<script>
import { screen } from "../../store"

let className
export { className as class }
</script>

<button class="btn btn--back {className}" on:click={screen.toPrevent}>
	<svg viewBox="0 0 17 6.5" width="17">
		<path d="M0 3l5 2.9V0L0 3zm16.5-.5h-12v1h12v-1z"/>
	</svg>
</button>