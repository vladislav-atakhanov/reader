
<div class="dropper">
	<div class="dropper__area">
		<h1>Drop</h1>
	</div>
</div>

<style>
.dropper {
	position: absolute;
	width: 100%;
	height: 100%;
	left: 0;
	bottom: 0;
	top: 0;
	right: 0;
	pointer-events: none;
	opacity: 0;
	transition: all 0.5s;
	padding: 1em;
	z-index: 10;
}
.dropper__area {
	width: 100%;
	height: 100%;
	border-radius: 1em;
	border: 2px dashed var(--text);
	display: flex;
	align-items: center;
	justify-content: center;
}
.dropper::before {
	content: "";
	position: absolute;
	left: 0; right: 0;
	bottom: 0; top: 0;
	background-color: var(--bg);
	opacity: .7;
	z-index: -1;
}

:global(.drag--active) .dropper {
	opacity: 1;
}
</style>