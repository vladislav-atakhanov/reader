<script>
// import { close } from "../../store"

let className
export { className as class }

function close() {

}
</script>

<button class="btn btn--close {className} fullscreen--on" on:click="{close}">
    <svg viewBox="0 0 14 14" stroke="currentColor" width="14"><path d="M13 1L1 13M1 1l12 12" stroke-linecap="round"/></svg>
</button>