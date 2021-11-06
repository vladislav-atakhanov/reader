<script>
import { screen } from "../../store"
export let name
</script>

<div class="screen screen--{name} {name == $screen.active ? 'screen--active' : ''}">
	<slot></slot>
</div>

<style>
.screen {
	position: absolute;
	left: 0; top: 0;
	pointer-events: none;
	opacity: 0;
	transition: all .5s;

	width: 100%;
	height: 100%;
}
.screen--active {
	pointer-events: all;
	opacity: 1;
	position: static;
}
</style>