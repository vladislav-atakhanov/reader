<script>
import { toggleFullscreen } from "../../store/keyboard"

let className
export { className as class }
</script>

<button class="btn btn--fullscreen {className}" on:click="{toggleFullscreen}">
	<svg viewBox="0 0 23 23" width="20" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor">
		<path d="M19.38 2.86L3.12 19.12M19.38 2.86l-1.13 5.37m1.13-5.37l-5.37 1.13M3.12 19.12l1.13-5.37m-1.13 5.37L8.5 18" class="fullscreen--off" /><path d="M5.24 21.5l1.42-5.65m0 0L1 17.26m5.66-1.41l9.19-9.2m0 0L17.26 1m-1.41 5.66l5.66-1.42" class="fullscreen--on" />
	</svg>
</button>