
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.42.3' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    class Store {
    	constructor(value) {
    		this.writable = writable(value);

    		this.subscribe = this.writable.subscribe;
    		this.set = this.writable.set;
    	}
    	add(id, value) {
    		this.writable.update($store => {
    			$store[id] = value;
    			return $store
    		});
    	}
    	get() {
    		let store;
    		this.writable.update($store => {
    			store = $store;
    			return $store
    		});
    		return store
    	}
    }

    let self$1;
    class Screen$1 extends Store {
    	constructor() {
    		super({});
    		this.active = "home";
    		this.prevent = "home";
    		self$1 = this;
    	}

    	set active(value) {
    		this._active = value;
    		this.add("active", value);
    	}
    	get active() {
    		return this._active
    	}

    	get prevent() {
    		return this._prevent
    	}
    	set prevent(value) {
    		this._prevent = value;
    		this.add("prevent", value);
    	}

    	toPrevent() {
    		[self$1.active, self$1.prevent] = [self$1.prevent, self$1.active];
    		if (self$1.active == self$1.prevent && self$1.active == "book")
    			self$1.active = "home";
    	}
    }

    let self;
    class Books extends Store {
    	constructor() {
    		super({
    			listId: []
    		});

    		this._list = {};
    		self = this;

    		this.set({
    			list: Object.keys(this._list)
    		});
    	}

    	async update() {
    		const text = await fetch("books.txt").then(data => data.text());
    		const ArrayOfId = [...text.split("\n")].map(id => id.trim());

    		ArrayOfId.forEach(async id => {
    			const data = await fetch("books/"+id).then(data => data.text());
    			self.add(id, {
    				data, inited: false
    			});
    		});
    	}

    	get active() {
    		return this._active
    	}
    	set active(value) {
    		this._active = value;
    		super.add("active", value);
    	}

    	add(id, value) {
    		this._list[id] = value;
    		super.add("list", this._list);
    		super.add("listId", Object.keys(this._list));
    	}
    }

    const _default = `{
	"scheme": "sepia",
	"book-width": 544,
	"book-width-tmp": 544,
	"book-height-tmp": 4,
	"book-height": 4,
	"font-weight": 400,
	"font-family": "Roboto Slab",
	"font-size": 16
}`;
    const theme$1 = localStorage.getItem("theme") || _default;


    class Theme extends Store {
    	constructor() {
    		super(JSON.parse(theme$1));
    	}
    	get(id) {
    		return super.get()[id]
    	}
    	add(id, value) {
    		super.add(id, value);
    		document.body.style.setProperty(
    			`--${id}`,
    			typeof value == "string" ? `"${value}"` : value
    		);
    		localStorage.setItem("theme", JSON.stringify(super.get()));
    	}
    }

    let theme = new Theme;
    let screen = new Screen$1;
    let books = new Books;

    /* src\components\buttons\back-btn.svelte generated by Svelte v3.42.3 */
    const file$j = "src\\components\\buttons\\back-btn.svelte";

    function create_fragment$n(ctx) {
    	let button;
    	let svg;
    	let path;
    	let button_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M0 3l5 2.9V0L0 3zm16.5-.5h-12v1h12v-1z");
    			add_location(path, file$j, 9, 2, 223);
    			attr_dev(svg, "viewBox", "0 0 17 6.5");
    			attr_dev(svg, "width", "17");
    			add_location(svg, file$j, 8, 1, 182);
    			attr_dev(button, "class", button_class_value = "btn btn--back " + /*className*/ ctx[0]);
    			add_location(button, file$j, 7, 0, 109);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, svg);
    			append_dev(svg, path);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", screen.toPrevent, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*className*/ 1 && button_class_value !== (button_class_value = "btn btn--back " + /*className*/ ctx[0])) {
    				attr_dev(button, "class", button_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$n.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$n($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Back_btn', slots, []);
    	let { class: className } = $$props;
    	const writable_props = ['class'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Back_btn> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(0, className = $$props.class);
    	};

    	$$self.$capture_state = () => ({ screen, className });

    	$$self.$inject_state = $$props => {
    		if ('className' in $$props) $$invalidate(0, className = $$props.className);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [className];
    }

    class Back_btn extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$n, create_fragment$n, safe_not_equal, { class: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Back_btn",
    			options,
    			id: create_fragment$n.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*className*/ ctx[0] === undefined && !('class' in props)) {
    			console.warn("<Back_btn> was created without expected prop 'class'");
    		}
    	}

    	get class() {
    		throw new Error("<Back_btn>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Back_btn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\buttons\settings-btn.svelte generated by Svelte v3.42.3 */

    const file$i = "src\\components\\buttons\\settings-btn.svelte";

    function create_fragment$m(ctx) {
    	let button;
    	let svg;
    	let path;
    	let button_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M13.3 8.5V7l1.6-1.2c.1-.2.2-.3 0-.5l-1.4-2.6c-.1-.2-.3-.2-.5-.2l-1.9.8-1.2-.8-.3-2a.4.4 0 00-.4-.2h-3a.4.4 0 00-.4.3l-.2 2a6 6 0 00-1.3.7l-1.9-.8a.4.4 0 00-.4.2L.5 5.3a.4.4 0 000 .5L2.2 7v1.5L.6 9.7a.4.4 0 000 .5L2 12.8c0 .2.3.2.5.2l1.8-.8 1.3.8.3 2 .4.2h3c.1 0 .3-.1.3-.3l.3-2c.5-.1.9-.4 1.3-.7l1.8.8c.2 0 .4 0 .5-.2l1.5-2.6v-.5l-1.7-1.2zm-5.6 1.9a2.6 2.6 0 110-5.3 2.6 2.6 0 010 5.3z");
    			add_location(path, file$i, 17, 2, 505);
    			attr_dev(svg, "viewBox", "0 0 16 16");
    			attr_dev(svg, "width", "16");
    			add_location(svg, file$i, 16, 1, 464);
    			attr_dev(button, "class", button_class_value = "btn btn--settings " + /*className*/ ctx[0]);
    			add_location(button, file$i, 13, 0, 361);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, svg);
    			append_dev(svg, path);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "mouseout", /*mouseout*/ ctx[2], false, false, false),
    					listen_dev(button, "mouseover", /*mouseover*/ ctx[1], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*className*/ 1 && button_class_value !== (button_class_value = "btn btn--settings " + /*className*/ ctx[0])) {
    				attr_dev(button, "class", button_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Settings_btn', slots, []);
    	let { class: className } = $$props;

    	const mouseover = () => {
    		document.querySelector(".header__settings").classList.add("popup-wrapper--active");
    	};

    	const mouseout = () => {
    		document.querySelector(".header__settings").classList.remove("popup-wrapper--active");
    	};

    	const writable_props = ['class'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Settings_btn> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(0, className = $$props.class);
    	};

    	$$self.$capture_state = () => ({ className, mouseover, mouseout });

    	$$self.$inject_state = $$props => {
    		if ('className' in $$props) $$invalidate(0, className = $$props.className);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [className, mouseover, mouseout];
    }

    class Settings_btn extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$m, create_fragment$m, safe_not_equal, { class: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Settings_btn",
    			options,
    			id: create_fragment$m.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*className*/ ctx[0] === undefined && !('class' in props)) {
    			console.warn("<Settings_btn> was created without expected prop 'class'");
    		}
    	}

    	get class() {
    		throw new Error("<Settings_btn>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Settings_btn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\buttons\chapters-btn.svelte generated by Svelte v3.42.3 */

    const file$h = "src\\components\\buttons\\chapters-btn.svelte";

    function create_fragment$l(ctx) {
    	let button;
    	let svg;
    	let path;
    	let button_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M4 1a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V1ZM4 6a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6ZM4 11a1 1 0 0 1 1-1h13a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-1ZM3 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM3 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM3 11.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z");
    			add_location(path, file$h, 17, 3, 526);
    			attr_dev(svg, "viewBox", "0 0 19 13");
    			attr_dev(svg, "width", "18");
    			attr_dev(svg, "fill", "currentColor");
    			add_location(svg, file$h, 16, 2, 465);
    			attr_dev(button, "class", button_class_value = "btn btn--chapters " + /*className*/ ctx[0]);
    			add_location(button, file$h, 13, 0, 361);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, svg);
    			append_dev(svg, path);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "mouseout", /*mouseout*/ ctx[2], false, false, false),
    					listen_dev(button, "mouseover", /*mouseover*/ ctx[1], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*className*/ 1 && button_class_value !== (button_class_value = "btn btn--chapters " + /*className*/ ctx[0])) {
    				attr_dev(button, "class", button_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Chapters_btn', slots, []);
    	let { class: className } = $$props;

    	const mouseover = () => {
    		document.querySelector(".header__chapters").classList.add("popup-wrapper--active");
    	};

    	const mouseout = () => {
    		document.querySelector(".header__chapters").classList.remove("popup-wrapper--active");
    	};

    	const writable_props = ['class'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Chapters_btn> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(0, className = $$props.class);
    	};

    	$$self.$capture_state = () => ({ className, mouseover, mouseout });

    	$$self.$inject_state = $$props => {
    		if ('className' in $$props) $$invalidate(0, className = $$props.className);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [className, mouseover, mouseout];
    }

    class Chapters_btn extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$l, create_fragment$l, safe_not_equal, { class: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Chapters_btn",
    			options,
    			id: create_fragment$l.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*className*/ ctx[0] === undefined && !('class' in props)) {
    			console.warn("<Chapters_btn> was created without expected prop 'class'");
    		}
    	}

    	get class() {
    		throw new Error("<Chapters_btn>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Chapters_btn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\buttons\add-btn.svelte generated by Svelte v3.42.3 */
    const file$g = "src\\components\\buttons\\add-btn.svelte";

    function create_fragment$k(ctx) {
    	let label;
    	let input;
    	let t0;
    	let span;
    	let t1;
    	let span_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label = element("label");
    			input = element("input");
    			t0 = space();
    			span = element("span");
    			t1 = text("+");
    			attr_dev(input, "type", "file");
    			input.multiple = true;
    			attr_dev(input, "class", "svelte-1caecej");
    			add_location(input, file$g, 26, 1, 419);
    			attr_dev(span, "class", span_class_value = "btn btn--add " + /*className*/ ctx[0] + " svelte-1caecej");
    			add_location(span, file$g, 27, 1, 470);
    			attr_dev(label, "class", "add-book svelte-1caecej");
    			add_location(label, file$g, 25, 0, 392);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, input);
    			append_dev(label, t0);
    			append_dev(label, span);
    			append_dev(span, t1);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*submit*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*className*/ 1 && span_class_value !== (span_class_value = "btn btn--add " + /*className*/ ctx[0] + " svelte-1caecej")) {
    				attr_dev(span, "class", span_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Add_btn', slots, []);
    	let { class: className } = $$props;

    	async function submit(e) {
    		for (const file of e.target.files) {
    			const reader = new FileReader();
    			const id = file.name;
    			reader.readAsText(file);

    			reader.onload = e => {
    				const data = reader.result;
    				books.add(id, { data, inited: false });
    			};
    		}
    	}

    	const writable_props = ['class'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Add_btn> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(0, className = $$props.class);
    	};

    	$$self.$capture_state = () => ({ books, className, submit });

    	$$self.$inject_state = $$props => {
    		if ('className' in $$props) $$invalidate(0, className = $$props.className);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [className, submit];
    }

    class Add_btn extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$k, create_fragment$k, safe_not_equal, { class: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Add_btn",
    			options,
    			id: create_fragment$k.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*className*/ ctx[0] === undefined && !('class' in props)) {
    			console.warn("<Add_btn> was created without expected prop 'class'");
    		}
    	}

    	get class() {
    		throw new Error("<Add_btn>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Add_btn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\header\left-controll.svelte generated by Svelte v3.42.3 */

    // (21:0) {#if $screen.active == "book" && chapters.length}
    function create_if_block_1$2(ctx) {
    	let chaptersbtn;
    	let current;

    	chaptersbtn = new Chapters_btn({
    			props: { class: "header__btn" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(chaptersbtn.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(chaptersbtn, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chaptersbtn.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chaptersbtn.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(chaptersbtn, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(21:0) {#if $screen.active == \\\"book\\\" && chapters.length}",
    		ctx
    	});

    	return block;
    }

    // (25:0) {#if $screen.active == "home"}
    function create_if_block$4(ctx) {
    	let addbtn;
    	let current;

    	addbtn = new Add_btn({
    			props: { class: "header__btn" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(addbtn.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(addbtn, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(addbtn.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(addbtn.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(addbtn, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(25:0) {#if $screen.active == \\\"home\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let backbtn;
    	let t0;
    	let settingsbtn;
    	let t1;
    	let t2;
    	let if_block1_anchor;
    	let current;

    	backbtn = new Back_btn({
    			props: { class: "header__btn" },
    			$$inline: true
    		});

    	settingsbtn = new Settings_btn({
    			props: { class: "header__btn" },
    			$$inline: true
    		});

    	let if_block0 = /*$screen*/ ctx[1].active == "book" && /*chapters*/ ctx[0].length && create_if_block_1$2(ctx);
    	let if_block1 = /*$screen*/ ctx[1].active == "home" && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			create_component(backbtn.$$.fragment);
    			t0 = space();
    			create_component(settingsbtn.$$.fragment);
    			t1 = space();
    			if (if_block0) if_block0.c();
    			t2 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(backbtn, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(settingsbtn, target, anchor);
    			insert_dev(target, t1, anchor);
    			if (if_block0) if_block0.m(target, anchor);
    			insert_dev(target, t2, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$screen*/ ctx[1].active == "book" && /*chapters*/ ctx[0].length) {
    				if (if_block0) {
    					if (dirty & /*$screen, chapters*/ 3) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_1$2(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(t2.parentNode, t2);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*$screen*/ ctx[1].active == "home") {
    				if (if_block1) {
    					if (dirty & /*$screen*/ 2) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$4(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(backbtn.$$.fragment, local);
    			transition_in(settingsbtn.$$.fragment, local);
    			transition_in(if_block0);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(backbtn.$$.fragment, local);
    			transition_out(settingsbtn.$$.fragment, local);
    			transition_out(if_block0);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(backbtn, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(settingsbtn, detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block0) if_block0.d(detaching);
    			if (detaching) detach_dev(t2);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let $books;
    	let $screen;
    	validate_store(books, 'books');
    	component_subscribe($$self, books, $$value => $$invalidate(3, $books = $$value));
    	validate_store(screen, 'screen');
    	component_subscribe($$self, screen, $$value => $$invalidate(1, $screen = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Left_controll', slots, []);
    	let book, chapters = [];
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Left_controll> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		BackBtn: Back_btn,
    		SettingsBtn: Settings_btn,
    		ChaptersBtn: Chapters_btn,
    		AddBtn: Add_btn,
    		screen,
    		books,
    		book,
    		chapters,
    		$books,
    		$screen
    	});

    	$$self.$inject_state = $$props => {
    		if ('book' in $$props) $$invalidate(2, book = $$props.book);
    		if ('chapters' in $$props) $$invalidate(0, chapters = $$props.chapters);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$books, book*/ 12) {
    			{
    				$$invalidate(2, book = $books.list[$books.active]);
    				if (book && book.chapters) $$invalidate(0, chapters = book.chapters);
    			}
    		}
    	};

    	return [chapters, $screen, book, $books];
    }

    class Left_controll extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Left_controll",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    function toggleFullscreen() {
    	const element = document.body;
    	const isFullscreen = document.webkitIsFullScreen || document.mozFullScreen || false;

    	element.requestFullScreen = element.requestFullScreen || element.webkitRequestFullScreen || element.mozRequestFullScreen || function () { return false; };
    	document.cancelFullScreen = document.cancelFullScreen || document.webkitCancelFullScreen || document.mozCancelFullScreen || function () { return false; };

    	isFullscreen ? document.cancelFullScreen() : element.requestFullScreen();
    }

    /* src\components\buttons\fullscreen-btn.svelte generated by Svelte v3.42.3 */
    const file$f = "src\\components\\buttons\\fullscreen-btn.svelte";

    function create_fragment$i(ctx) {
    	let button;
    	let svg;
    	let path0;
    	let path1;
    	let button_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M19.38 2.86L3.12 19.12M19.38 2.86l-1.13 5.37m1.13-5.37l-5.37 1.13M3.12 19.12l1.13-5.37m-1.13 5.37L8.5 18");
    			attr_dev(path0, "class", "fullscreen--off");
    			add_location(path0, file$f, 9, 2, 318);
    			attr_dev(path1, "d", "M5.24 21.5l1.42-5.65m0 0L1 17.26m5.66-1.41l9.19-9.2m0 0L17.26 1m-1.41 5.66l5.66-1.42");
    			attr_dev(path1, "class", "fullscreen--on");
    			add_location(path1, file$f, 9, 143, 459);
    			attr_dev(svg, "viewBox", "0 0 23 23");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "stroke-linecap", "round");
    			attr_dev(svg, "stroke-linejoin", "round");
    			attr_dev(svg, "stroke", "currentColor");
    			add_location(svg, file$f, 8, 1, 209);
    			attr_dev(button, "class", button_class_value = "btn btn--fullscreen " + /*className*/ ctx[0]);
    			add_location(button, file$f, 7, 0, 128);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, svg);
    			append_dev(svg, path0);
    			append_dev(svg, path1);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", toggleFullscreen, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*className*/ 1 && button_class_value !== (button_class_value = "btn btn--fullscreen " + /*className*/ ctx[0])) {
    				attr_dev(button, "class", button_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Fullscreen_btn', slots, []);
    	let { class: className } = $$props;
    	const writable_props = ['class'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Fullscreen_btn> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(0, className = $$props.class);
    	};

    	$$self.$capture_state = () => ({ toggleFullscreen, className });

    	$$self.$inject_state = $$props => {
    		if ('className' in $$props) $$invalidate(0, className = $$props.className);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [className];
    }

    class Fullscreen_btn extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, { class: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Fullscreen_btn",
    			options,
    			id: create_fragment$i.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*className*/ ctx[0] === undefined && !('class' in props)) {
    			console.warn("<Fullscreen_btn> was created without expected prop 'class'");
    		}
    	}

    	get class() {
    		throw new Error("<Fullscreen_btn>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Fullscreen_btn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\buttons\close-btn.svelte generated by Svelte v3.42.3 */

    const file$e = "src\\components\\buttons\\close-btn.svelte";

    function create_fragment$h(ctx) {
    	let button;
    	let svg;
    	let path;
    	let button_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M13 1L1 13M1 1l12 12");
    			attr_dev(path, "stroke-linecap", "round");
    			add_location(path, file$e, 12, 62, 279);
    			attr_dev(svg, "viewBox", "0 0 14 14");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "width", "14");
    			add_location(svg, file$e, 12, 4, 221);
    			attr_dev(button, "class", button_class_value = "btn btn--close " + /*className*/ ctx[0] + " fullscreen--on");
    			add_location(button, file$e, 11, 0, 138);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, svg);
    			append_dev(svg, path);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", close, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*className*/ 1 && button_class_value !== (button_class_value = "btn btn--close " + /*className*/ ctx[0] + " fullscreen--on")) {
    				attr_dev(button, "class", button_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function close() {
    	
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Close_btn', slots, []);
    	let { class: className } = $$props;
    	const writable_props = ['class'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Close_btn> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('class' in $$props) $$invalidate(0, className = $$props.class);
    	};

    	$$self.$capture_state = () => ({ className, close });

    	$$self.$inject_state = $$props => {
    		if ('className' in $$props) $$invalidate(0, className = $$props.className);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [className];
    }

    class Close_btn extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, { class: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Close_btn",
    			options,
    			id: create_fragment$h.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*className*/ ctx[0] === undefined && !('class' in props)) {
    			console.warn("<Close_btn> was created without expected prop 'class'");
    		}
    	}

    	get class() {
    		throw new Error("<Close_btn>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Close_btn>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\header\right-controll.svelte generated by Svelte v3.42.3 */

    function create_fragment$g(ctx) {
    	let fullscreenbtn;
    	let current;

    	fullscreenbtn = new Fullscreen_btn({
    			props: { class: "header__btn" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(fullscreenbtn.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(fullscreenbtn, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(fullscreenbtn.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(fullscreenbtn.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(fullscreenbtn, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Right_controll', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Right_controll> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ FullscreenBtn: Fullscreen_btn, CloseBtn: Close_btn });
    	return [];
    }

    class Right_controll extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Right_controll",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* src\components\inputs\range.svelte generated by Svelte v3.42.3 */
    const file$d = "src\\components\\inputs\\range.svelte";

    function create_fragment$f(ctx) {
    	let div3;
    	let input_1;
    	let t0;
    	let div2;
    	let div0;
    	let t1;
    	let div1;
    	let div3_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			input_1 = element("input");
    			t0 = space();
    			div2 = element("div");
    			div0 = element("div");
    			t1 = space();
    			div1 = element("div");
    			attr_dev(input_1, "type", "range");
    			attr_dev(input_1, "min", /*min*/ ctx[2]);
    			attr_dev(input_1, "max", /*max*/ ctx[3]);
    			attr_dev(input_1, "class", "svelte-d8q7c5");
    			add_location(input_1, file$d, 33, 1, 555);
    			attr_dev(div0, "class", "range__track svelte-d8q7c5");
    			add_location(div0, file$d, 40, 2, 751);
    			attr_dev(div1, "class", "range__thumb svelte-d8q7c5");
    			add_location(div1, file$d, 41, 2, 787);
    			attr_dev(div2, "class", "range svelte-d8q7c5");
    			set_style(div2, "--percent", /*percent*/ ctx[4] + "%");
    			add_location(div2, file$d, 39, 1, 698);
    			attr_dev(div3, "class", div3_class_value = "wrapper " + /*className*/ ctx[1] + " svelte-d8q7c5");
    			add_location(div3, file$d, 32, 0, 519);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, input_1);
    			set_input_value(input_1, /*_value*/ ctx[0]);
    			append_dev(div3, t0);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input_1, "change", /*input_1_change_input_handler*/ ctx[8]),
    					listen_dev(input_1, "input", /*input_1_change_input_handler*/ ctx[8]),
    					listen_dev(input_1, "change", /*change*/ ctx[5], false, false, false),
    					listen_dev(input_1, "input", /*input*/ ctx[6], false, false, false),
    					listen_dev(input_1, "pointerup", /*change*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*min*/ 4) {
    				attr_dev(input_1, "min", /*min*/ ctx[2]);
    			}

    			if (dirty & /*max*/ 8) {
    				attr_dev(input_1, "max", /*max*/ ctx[3]);
    			}

    			if (dirty & /*_value*/ 1) {
    				set_input_value(input_1, /*_value*/ ctx[0]);
    			}

    			if (dirty & /*percent*/ 16) {
    				set_style(div2, "--percent", /*percent*/ ctx[4] + "%");
    			}

    			if (dirty & /*className*/ 2 && div3_class_value !== (div3_class_value = "wrapper " + /*className*/ ctx[1] + " svelte-d8q7c5")) {
    				attr_dev(div3, "class", div3_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Range', slots, []);
    	let { className } = $$props;
    	let { min = 0 } = $$props;
    	let { max = 100 } = $$props;
    	let { value } = $$props;
    	let { _value } = $$props;
    	let _valueUnsetted = !_value;
    	if (_valueUnsetted) _value = value;
    	const dispatch = createEventDispatcher();

    	const change = e => {
    		$$invalidate(7, value = _value);
    		dispatch("change", e);
    	};

    	const input = e => {
    		if (_valueUnsetted) $$invalidate(7, value = _value);
    		dispatch("input", e);
    	};

    	let percent = 0;
    	const writable_props = ['className', 'min', 'max', 'value', '_value'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Range> was created with unknown prop '${key}'`);
    	});

    	function input_1_change_input_handler() {
    		_value = to_number(this.value);
    		$$invalidate(0, _value);
    	}

    	$$self.$$set = $$props => {
    		if ('className' in $$props) $$invalidate(1, className = $$props.className);
    		if ('min' in $$props) $$invalidate(2, min = $$props.min);
    		if ('max' in $$props) $$invalidate(3, max = $$props.max);
    		if ('value' in $$props) $$invalidate(7, value = $$props.value);
    		if ('_value' in $$props) $$invalidate(0, _value = $$props._value);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		className,
    		min,
    		max,
    		value,
    		_value,
    		_valueUnsetted,
    		dispatch,
    		change,
    		input,
    		percent
    	});

    	$$self.$inject_state = $$props => {
    		if ('className' in $$props) $$invalidate(1, className = $$props.className);
    		if ('min' in $$props) $$invalidate(2, min = $$props.min);
    		if ('max' in $$props) $$invalidate(3, max = $$props.max);
    		if ('value' in $$props) $$invalidate(7, value = $$props.value);
    		if ('_value' in $$props) $$invalidate(0, _value = $$props._value);
    		if ('_valueUnsetted' in $$props) _valueUnsetted = $$props._valueUnsetted;
    		if ('percent' in $$props) $$invalidate(4, percent = $$props.percent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*_value, min, max*/ 13) {
    			$$invalidate(4, percent = (_value - min) / (max - min) * 100);
    		}
    	};

    	return [
    		_value,
    		className,
    		min,
    		max,
    		percent,
    		change,
    		input,
    		value,
    		input_1_change_input_handler
    	];
    }

    class Range extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {
    			className: 1,
    			min: 2,
    			max: 3,
    			value: 7,
    			_value: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Range",
    			options,
    			id: create_fragment$f.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*className*/ ctx[1] === undefined && !('className' in props)) {
    			console.warn("<Range> was created without expected prop 'className'");
    		}

    		if (/*value*/ ctx[7] === undefined && !('value' in props)) {
    			console.warn("<Range> was created without expected prop 'value'");
    		}

    		if (/*_value*/ ctx[0] === undefined && !('_value' in props)) {
    			console.warn("<Range> was created without expected prop '_value'");
    		}
    	}

    	get className() {
    		throw new Error("<Range>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set className(value) {
    		throw new Error("<Range>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get min() {
    		throw new Error("<Range>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set min(value) {
    		throw new Error("<Range>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get max() {
    		throw new Error("<Range>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set max(value) {
    		throw new Error("<Range>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Range>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Range>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get _value() {
    		throw new Error("<Range>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set _value(value) {
    		throw new Error("<Range>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\inputs\radio.svelte generated by Svelte v3.42.3 */

    const file$c = "src\\components\\inputs\\radio.svelte";

    function create_fragment$e(ctx) {
    	let label_1;
    	let input;
    	let t0;
    	let div;
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			label_1 = element("label");
    			input = element("input");
    			t0 = space();
    			div = element("div");
    			t1 = text(/*label*/ ctx[2]);
    			attr_dev(input, "type", "radio");
    			input.__value = /*value*/ ctx[1];
    			input.value = input.__value;
    			attr_dev(input, "class", "radio__input svelte-1cmymy4");
    			/*$$binding_groups*/ ctx[5][0].push(input);
    			add_location(input, file$c, 10, 1, 131);
    			attr_dev(div, "class", "radio__label svelte-1cmymy4");
    			add_location(div, file$c, 11, 1, 204);
    			attr_dev(label_1, "class", "radio svelte-1cmymy4");
    			attr_dev(label_1, "style", /*style*/ ctx[3]);
    			add_location(label_1, file$c, 9, 0, 99);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label_1, anchor);
    			append_dev(label_1, input);
    			input.checked = input.__value === /*group*/ ctx[0];
    			append_dev(label_1, t0);
    			append_dev(label_1, div);
    			append_dev(div, t1);

    			if (!mounted) {
    				dispose = listen_dev(input, "change", /*input_change_handler*/ ctx[4]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*value*/ 2) {
    				prop_dev(input, "__value", /*value*/ ctx[1]);
    				input.value = input.__value;
    			}

    			if (dirty & /*group*/ 1) {
    				input.checked = input.__value === /*group*/ ctx[0];
    			}

    			if (dirty & /*label*/ 4) set_data_dev(t1, /*label*/ ctx[2]);

    			if (dirty & /*style*/ 8) {
    				attr_dev(label_1, "style", /*style*/ ctx[3]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label_1);
    			/*$$binding_groups*/ ctx[5][0].splice(/*$$binding_groups*/ ctx[5][0].indexOf(input), 1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Radio', slots, []);
    	let { group } = $$props;
    	let { value } = $$props;
    	let { label } = $$props;
    	let { style } = $$props;
    	const writable_props = ['group', 'value', 'label', 'style'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Radio> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[]];

    	function input_change_handler() {
    		group = this.__value;
    		$$invalidate(0, group);
    	}

    	$$self.$$set = $$props => {
    		if ('group' in $$props) $$invalidate(0, group = $$props.group);
    		if ('value' in $$props) $$invalidate(1, value = $$props.value);
    		if ('label' in $$props) $$invalidate(2, label = $$props.label);
    		if ('style' in $$props) $$invalidate(3, style = $$props.style);
    	};

    	$$self.$capture_state = () => ({ group, value, label, style });

    	$$self.$inject_state = $$props => {
    		if ('group' in $$props) $$invalidate(0, group = $$props.group);
    		if ('value' in $$props) $$invalidate(1, value = $$props.value);
    		if ('label' in $$props) $$invalidate(2, label = $$props.label);
    		if ('style' in $$props) $$invalidate(3, style = $$props.style);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [group, value, label, style, input_change_handler, $$binding_groups];
    }

    class Radio extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { group: 0, value: 1, label: 2, style: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Radio",
    			options,
    			id: create_fragment$e.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*group*/ ctx[0] === undefined && !('group' in props)) {
    			console.warn("<Radio> was created without expected prop 'group'");
    		}

    		if (/*value*/ ctx[1] === undefined && !('value' in props)) {
    			console.warn("<Radio> was created without expected prop 'value'");
    		}

    		if (/*label*/ ctx[2] === undefined && !('label' in props)) {
    			console.warn("<Radio> was created without expected prop 'label'");
    		}

    		if (/*style*/ ctx[3] === undefined && !('style' in props)) {
    			console.warn("<Radio> was created without expected prop 'style'");
    		}
    	}

    	get group() {
    		throw new Error("<Radio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set group(value) {
    		throw new Error("<Radio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Radio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Radio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<Radio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Radio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Radio>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Radio>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\inputs\select.svelte generated by Svelte v3.42.3 */

    const file$b = "src\\components\\inputs\\select.svelte";

    function create_fragment$d(ctx) {
    	let div1;
    	let select;
    	let select_class_value;
    	let t0;
    	let div0;
    	let t1;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			select = element("select");
    			if (default_slot) default_slot.c();
    			t0 = space();
    			div0 = element("div");
    			t1 = text(/*textValue*/ ctx[4]);
    			attr_dev(select, "class", select_class_value = "" + (null_to_empty(/*className*/ ctx[1]) + " svelte-g580vn"));
    			if (/*value*/ ctx[0] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[8].call(select));
    			add_location(select, file$b, 18, 1, 287);
    			attr_dev(div0, "class", "select svelte-g580vn");
    			set_style(div0, "width", /*width*/ ctx[3] + "px");
    			add_location(div0, file$b, 21, 1, 381);
    			attr_dev(div1, "class", "wrapper svelte-g580vn");
    			add_location(div1, file$b, 17, 0, 263);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, select);

    			if (default_slot) {
    				default_slot.m(select, null);
    			}

    			/*select_binding*/ ctx[7](select);
    			select_option(select, /*value*/ ctx[0]);
    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, t1);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(select, "change", /*select_change_handler*/ ctx[8]);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 32)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[5],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[5])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*className*/ 2 && select_class_value !== (select_class_value = "" + (null_to_empty(/*className*/ ctx[1]) + " svelte-g580vn"))) {
    				attr_dev(select, "class", select_class_value);
    			}

    			if (dirty & /*value*/ 1) {
    				select_option(select, /*value*/ ctx[0]);
    			}

    			if (!current || dirty & /*textValue*/ 16) set_data_dev(t1, /*textValue*/ ctx[4]);

    			if (!current || dirty & /*width*/ 8) {
    				set_style(div0, "width", /*width*/ ctx[3] + "px");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (default_slot) default_slot.d(detaching);
    			/*select_binding*/ ctx[7](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Select', slots, ['default']);
    	let { className } = $$props;
    	let { value } = $$props;
    	let width;
    	let el, textValue;
    	const writable_props = ['className', 'value'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Select> was created with unknown prop '${key}'`);
    	});

    	function select_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			el = $$value;
    			$$invalidate(2, el);
    		});
    	}

    	function select_change_handler() {
    		value = select_value(this);
    		$$invalidate(0, value);
    	}

    	$$self.$$set = $$props => {
    		if ('className' in $$props) $$invalidate(1, className = $$props.className);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('$$scope' in $$props) $$invalidate(5, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ className, value, width, el, textValue });

    	$$self.$inject_state = $$props => {
    		if ('className' in $$props) $$invalidate(1, className = $$props.className);
    		if ('value' in $$props) $$invalidate(0, value = $$props.value);
    		if ('width' in $$props) $$invalidate(3, width = $$props.width);
    		if ('el' in $$props) $$invalidate(2, el = $$props.el);
    		if ('textValue' in $$props) $$invalidate(4, textValue = $$props.textValue);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*el, value*/ 5) {
    			{
    				if (el) {
    					$$invalidate(3, width = el?.offsetWidth);
    					const selected = el.querySelector(`[value="${value}"]`);
    					$$invalidate(4, textValue = selected ? selected.innerText : value);
    				}
    			}
    		}
    	};

    	return [
    		value,
    		className,
    		el,
    		width,
    		textValue,
    		$$scope,
    		slots,
    		select_binding,
    		select_change_handler
    	];
    }

    class Select extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { className: 1, value: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Select",
    			options,
    			id: create_fragment$d.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*className*/ ctx[1] === undefined && !('className' in props)) {
    			console.warn("<Select> was created without expected prop 'className'");
    		}

    		if (/*value*/ ctx[0] === undefined && !('value' in props)) {
    			console.warn("<Select> was created without expected prop 'value'");
    		}
    	}

    	get className() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set className(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Select>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Select>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\book\active-book.svelte generated by Svelte v3.42.3 */
    const file$a = "src\\components\\book\\active-book.svelte";

    // (18:0) {#if $screen.active == "book" && book && book.inited}
    function create_if_block$3(ctx) {
    	let div;
    	let p0;
    	let t0_value = /*book*/ ctx[0].title + "";
    	let t0;
    	let t1;
    	let p1;
    	let t2_value = /*book*/ ctx[0].author + "";
    	let t2;
    	let t3;
    	let t4;
    	let p2;
    	let t5_value = Math.floor(/*book*/ ctx[0].progress * 1000) / 10 + "";
    	let t5;
    	let t6;
    	let if_block = /*book*/ ctx[0].chapter && create_if_block_1$1(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			p0 = element("p");
    			t0 = text(t0_value);
    			t1 = space();
    			p1 = element("p");
    			t2 = text(t2_value);
    			t3 = space();
    			if (if_block) if_block.c();
    			t4 = space();
    			p2 = element("p");
    			t5 = text(t5_value);
    			t6 = text("%");
    			attr_dev(p0, "class", "book__title svelte-1aisi1b");
    			add_location(p0, file$a, 19, 2, 395);
    			attr_dev(p1, "class", "book__author svelte-1aisi1b");
    			add_location(p1, file$a, 20, 2, 438);
    			attr_dev(p2, "class", "book__progress svelte-1aisi1b");
    			add_location(p2, file$a, 25, 2, 580);
    			attr_dev(div, "class", "book svelte-1aisi1b");
    			add_location(div, file$a, 18, 1, 373);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, p0);
    			append_dev(p0, t0);
    			append_dev(div, t1);
    			append_dev(div, p1);
    			append_dev(p1, t2);
    			append_dev(div, t3);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t4);
    			append_dev(div, p2);
    			append_dev(p2, t5);
    			append_dev(p2, t6);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*book*/ 1 && t0_value !== (t0_value = /*book*/ ctx[0].title + "")) set_data_dev(t0, t0_value);
    			if (dirty & /*book*/ 1 && t2_value !== (t2_value = /*book*/ ctx[0].author + "")) set_data_dev(t2, t2_value);

    			if (/*book*/ ctx[0].chapter) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1$1(ctx);
    					if_block.c();
    					if_block.m(div, t4);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*book*/ 1 && t5_value !== (t5_value = Math.floor(/*book*/ ctx[0].progress * 1000) / 10 + "")) set_data_dev(t5, t5_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(18:0) {#if $screen.active == \\\"book\\\" && book && book.inited}",
    		ctx
    	});

    	return block;
    }

    // (23:2) {#if book.chapter}
    function create_if_block_1$1(ctx) {
    	let p;
    	let raw_value = /*book*/ ctx[0].chapter.innerHTML + "";

    	const block = {
    		c: function create() {
    			p = element("p");
    			attr_dev(p, "class", "book__chapter svelte-1aisi1b");
    			add_location(p, file$a, 23, 3, 508);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			p.innerHTML = raw_value;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*book*/ 1 && raw_value !== (raw_value = /*book*/ ctx[0].chapter.innerHTML + "")) p.innerHTML = raw_value;		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(23:2) {#if book.chapter}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let title_value;
    	let t;
    	let if_block_anchor;
    	document.title = title_value = /*documentTitle*/ ctx[2];
    	let if_block = /*$screen*/ ctx[1].active == "book" && /*book*/ ctx[0] && /*book*/ ctx[0].inited && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			t = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*documentTitle*/ 4 && title_value !== (title_value = /*documentTitle*/ ctx[2])) {
    				document.title = title_value;
    			}

    			if (/*$screen*/ ctx[1].active == "book" && /*book*/ ctx[0] && /*book*/ ctx[0].inited) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let $screen;
    	let $books;
    	validate_store(screen, 'screen');
    	component_subscribe($$self, screen, $$value => $$invalidate(1, $screen = $$value));
    	validate_store(books, 'books');
    	component_subscribe($$self, books, $$value => $$invalidate(3, $books = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Active_book', slots, []);
    	let book, documentTitle;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Active_book> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		books,
    		screen,
    		book,
    		documentTitle,
    		$screen,
    		$books
    	});

    	$$self.$inject_state = $$props => {
    		if ('book' in $$props) $$invalidate(0, book = $$props.book);
    		if ('documentTitle' in $$props) $$invalidate(2, documentTitle = $$props.documentTitle);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$books, $screen, book*/ 11) {
    			{
    				$$invalidate(0, book = $books.list[$books.active]);
    				if ($screen.active == "book") $$invalidate(2, documentTitle = `${book.title} - Reader`); else $$invalidate(2, documentTitle = "Reader");
    			}
    		}
    	};

    	return [book, $screen, documentTitle, $books];
    }

    class Active_book extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Active_book",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src\components\settings.svelte generated by Svelte v3.42.3 */
    const file$9 = "src\\components\\settings.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[18] = list[i];
    	return child_ctx;
    }

    // (70:2) <Select className="scheme__input" bind:value="{scheme}">
    function create_default_slot_1(ctx) {
    	let option0;
    	let t1;
    	let option1;
    	let t3;
    	let option2;
    	let t5;
    	let option3;
    	let t7;
    	let option4;
    	let t9;
    	let option5;
    	let t11;
    	let option6;

    	const block = {
    		c: function create() {
    			option0 = element("option");
    			option0.textContent = "Сепия";
    			t1 = space();
    			option1 = element("option");
    			option1.textContent = "Сепия контарст";
    			t3 = space();
    			option2 = element("option");
    			option2.textContent = "День";
    			t5 = space();
    			option3 = element("option");
    			option3.textContent = "Ночь";
    			t7 = space();
    			option4 = element("option");
    			option4.textContent = "Ночь контарст";
    			t9 = space();
    			option5 = element("option");
    			option5.textContent = "Сумерки";
    			t11 = space();
    			option6 = element("option");
    			option6.textContent = "Консоль";
    			option0.__value = "sepia";
    			option0.value = option0.__value;
    			add_location(option0, file$9, 70, 3, 1886);
    			option1.__value = "sepia-contrast";
    			option1.value = option1.__value;
    			add_location(option1, file$9, 71, 3, 1927);
    			option2.__value = "day";
    			option2.value = option2.__value;
    			add_location(option2, file$9, 72, 3, 1986);
    			option3.__value = "night";
    			option3.value = option3.__value;
    			add_location(option3, file$9, 73, 3, 2024);
    			option4.__value = "night-contrast";
    			option4.value = option4.__value;
    			add_location(option4, file$9, 74, 3, 2064);
    			option5.__value = "dusk";
    			option5.value = option5.__value;
    			add_location(option5, file$9, 75, 3, 2122);
    			option6.__value = "console";
    			option6.value = option6.__value;
    			add_location(option6, file$9, 76, 3, 2164);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, option1, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, option2, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, option3, anchor);
    			insert_dev(target, t7, anchor);
    			insert_dev(target, option4, anchor);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, option5, anchor);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, option6, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(option1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(option2);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(option3);
    			if (detaching) detach_dev(t7);
    			if (detaching) detach_dev(option4);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(option5);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(option6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(70:2) <Select className=\\\"scheme__input\\\" bind:value=\\\"{scheme}\\\">",
    		ctx
    	});

    	return block;
    }

    // (83:2) <Select className="font__input" bind:value="{fontFamily}">
    function create_default_slot$2(ctx) {
    	let option0;
    	let t1;
    	let option1;
    	let t3;
    	let option2;
    	let t5;
    	let option3;

    	const block = {
    		c: function create() {
    			option0 = element("option");
    			option0.textContent = "Roboto Slab";
    			t1 = space();
    			option1 = element("option");
    			option1.textContent = "Jura";
    			t3 = space();
    			option2 = element("option");
    			option2.textContent = "Playfair Display";
    			t5 = space();
    			option3 = element("option");
    			option3.textContent = "Raleway";
    			option0.__value = "RobotoSlab";
    			option0.value = option0.__value;
    			add_location(option0, file$9, 83, 3, 2392);
    			option1.__value = "Jura";
    			option1.value = option1.__value;
    			add_location(option1, file$9, 84, 3, 2444);
    			option2.__value = "PlayfairDisplay";
    			option2.value = option2.__value;
    			add_location(option2, file$9, 85, 3, 2483);
    			option3.__value = "Raleway";
    			option3.value = option3.__value;
    			add_location(option3, file$9, 86, 3, 2545);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, option1, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, option2, anchor);
    			insert_dev(target, t5, anchor);
    			insert_dev(target, option3, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(option1);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(option2);
    			if (detaching) detach_dev(t5);
    			if (detaching) detach_dev(option3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(83:2) <Select className=\\\"font__input\\\" bind:value=\\\"{fontFamily}\\\">",
    		ctx
    	});

    	return block;
    }

    // (94:3) {#each [300, 400, 600, 700] as weight }
    function create_each_block$3(ctx) {
    	let radio;
    	let updating_group;
    	let current;

    	function radio_group_binding(value) {
    		/*radio_group_binding*/ ctx[16](value);
    	}

    	let radio_props = {
    		value: /*weight*/ ctx[18],
    		label: "А",
    		style: "font-weight: " + /*weight*/ ctx[18] + ";"
    	};

    	if (/*fontWeight*/ ctx[5] !== void 0) {
    		radio_props.group = /*fontWeight*/ ctx[5];
    	}

    	radio = new Radio({ props: radio_props, $$inline: true });
    	binding_callbacks.push(() => bind(radio, 'group', radio_group_binding));

    	const block = {
    		c: function create() {
    			create_component(radio.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(radio, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const radio_changes = {};

    			if (!updating_group && dirty & /*fontWeight*/ 32) {
    				updating_group = true;
    				radio_changes.group = /*fontWeight*/ ctx[5];
    				add_flush_callback(() => updating_group = false);
    			}

    			radio.$set(radio_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(radio.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(radio.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(radio, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(94:3) {#each [300, 400, 600, 700] as weight }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div5;
    	let activebook;
    	let t0;
    	let div0;
    	let h30;
    	let t1;
    	let span0;
    	let t2;
    	let t3;
    	let t4_value = /*_height*/ ctx[3] * 2 + "";
    	let t4;
    	let t5;
    	let range0;
    	let updating_value;
    	let updating__value;
    	let t6;
    	let range1;
    	let updating_value_1;
    	let updating__value_1;
    	let t7;
    	let div1;
    	let h31;
    	let t8;
    	let br;
    	let t9;
    	let t10;
    	let select0;
    	let updating_value_2;
    	let t11;
    	let div2;
    	let h32;
    	let t13;
    	let select1;
    	let updating_value_3;
    	let t14;
    	let div3;
    	let h33;
    	let t15;
    	let span1;
    	let t16;
    	let t17;
    	let fieldset;
    	let t18;
    	let div4;
    	let h34;
    	let t19;
    	let span2;
    	let t20;
    	let t21;
    	let range2;
    	let updating_value_4;
    	let current;
    	activebook = new Active_book({ $$inline: true });

    	function range0_value_binding(value) {
    		/*range0_value_binding*/ ctx[10](value);
    	}

    	function range0__value_binding(value) {
    		/*range0__value_binding*/ ctx[11](value);
    	}

    	let range0_props = {
    		className: "width__input",
    		min: "100",
    		max: window.innerWidth - 20
    	};

    	if (/*width*/ ctx[2] !== void 0) {
    		range0_props.value = /*width*/ ctx[2];
    	}

    	if (/*_width*/ ctx[1] !== void 0) {
    		range0_props._value = /*_width*/ ctx[1];
    	}

    	range0 = new Range({ props: range0_props, $$inline: true });
    	binding_callbacks.push(() => bind(range0, 'value', range0_value_binding));
    	binding_callbacks.push(() => bind(range0, '_value', range0__value_binding));
    	range0.$on("change", /*change*/ ctx[8]);
    	range0.$on("input", /*input*/ ctx[9]);

    	function range1_value_binding(value) {
    		/*range1_value_binding*/ ctx[12](value);
    	}

    	function range1__value_binding(value) {
    		/*range1__value_binding*/ ctx[13](value);
    	}

    	let range1_props = {
    		className: "width__input",
    		min: "2",
    		max: Math.floor(window.innerHeight / (/*fontSize*/ ctx[7] * 2 * 1.25))
    	};

    	if (/*height*/ ctx[4] !== void 0) {
    		range1_props.value = /*height*/ ctx[4];
    	}

    	if (/*_height*/ ctx[3] !== void 0) {
    		range1_props._value = /*_height*/ ctx[3];
    	}

    	range1 = new Range({ props: range1_props, $$inline: true });
    	binding_callbacks.push(() => bind(range1, 'value', range1_value_binding));
    	binding_callbacks.push(() => bind(range1, '_value', range1__value_binding));
    	range1.$on("change", /*change*/ ctx[8]);
    	range1.$on("input", /*input*/ ctx[9]);

    	function select0_value_binding(value) {
    		/*select0_value_binding*/ ctx[14](value);
    	}

    	let select0_props = {
    		className: "scheme__input",
    		$$slots: { default: [create_default_slot_1] },
    		$$scope: { ctx }
    	};

    	if (/*scheme*/ ctx[0] !== void 0) {
    		select0_props.value = /*scheme*/ ctx[0];
    	}

    	select0 = new Select({ props: select0_props, $$inline: true });
    	binding_callbacks.push(() => bind(select0, 'value', select0_value_binding));

    	function select1_value_binding(value) {
    		/*select1_value_binding*/ ctx[15](value);
    	}

    	let select1_props = {
    		className: "font__input",
    		$$slots: { default: [create_default_slot$2] },
    		$$scope: { ctx }
    	};

    	if (/*fontFamily*/ ctx[6] !== void 0) {
    		select1_props.value = /*fontFamily*/ ctx[6];
    	}

    	select1 = new Select({ props: select1_props, $$inline: true });
    	binding_callbacks.push(() => bind(select1, 'value', select1_value_binding));
    	let each_value = [300, 400, 600, 700];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < 4; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	function range2_value_binding(value) {
    		/*range2_value_binding*/ ctx[17](value);
    	}

    	let range2_props = {
    		className: "font-size__input",
    		min: "12",
    		max: "30"
    	};

    	if (/*fontSize*/ ctx[7] !== void 0) {
    		range2_props.value = /*fontSize*/ ctx[7];
    	}

    	range2 = new Range({ props: range2_props, $$inline: true });
    	binding_callbacks.push(() => bind(range2, 'value', range2_value_binding));

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			create_component(activebook.$$.fragment);
    			t0 = space();
    			div0 = element("div");
    			h30 = element("h3");
    			t1 = text("Размер текста ");
    			span0 = element("span");
    			t2 = text(/*_width*/ ctx[1]);
    			t3 = text("x");
    			t4 = text(t4_value);
    			t5 = space();
    			create_component(range0.$$.fragment);
    			t6 = space();
    			create_component(range1.$$.fragment);
    			t7 = space();
    			div1 = element("div");
    			h31 = element("h3");
    			t8 = text("Цветовая");
    			br = element("br");
    			t9 = text("схема");
    			t10 = space();
    			create_component(select0.$$.fragment);
    			t11 = space();
    			div2 = element("div");
    			h32 = element("h3");
    			h32.textContent = "Шрифт";
    			t13 = space();
    			create_component(select1.$$.fragment);
    			t14 = space();
    			div3 = element("div");
    			h33 = element("h3");
    			t15 = text("Жирность ");
    			span1 = element("span");
    			t16 = text(/*fontWeight*/ ctx[5]);
    			t17 = space();
    			fieldset = element("fieldset");

    			for (let i = 0; i < 4; i += 1) {
    				each_blocks[i].c();
    			}

    			t18 = space();
    			div4 = element("div");
    			h34 = element("h3");
    			t19 = text("Кегль ");
    			span2 = element("span");
    			t20 = text(/*fontSize*/ ctx[7]);
    			t21 = space();
    			create_component(range2.$$.fragment);
    			attr_dev(span0, "class", "svelte-nrlmcn");
    			add_location(span0, file$9, 45, 43, 1200);
    			attr_dev(h30, "class", "setting__title svelte-nrlmcn");
    			add_location(h30, file$9, 45, 2, 1159);
    			attr_dev(div0, "class", "settings__field svelte-nrlmcn");
    			add_location(div0, file$9, 44, 1, 1126);
    			add_location(br, file$9, 68, 37, 1807);
    			attr_dev(h31, "class", "setting__title svelte-nrlmcn");
    			add_location(h31, file$9, 68, 2, 1772);
    			attr_dev(div1, "class", "settings__field settings__field--select svelte-nrlmcn");
    			add_location(div1, file$9, 67, 1, 1715);
    			attr_dev(h32, "class", "setting__title svelte-nrlmcn");
    			add_location(h32, file$9, 81, 2, 2288);
    			attr_dev(div2, "class", "settings__field settings__field--select svelte-nrlmcn");
    			add_location(div2, file$9, 80, 1, 2231);
    			attr_dev(span1, "class", "svelte-nrlmcn");
    			add_location(span1, file$9, 91, 73, 2716);
    			attr_dev(h33, "class", "setting__title svelte-nrlmcn");
    			set_style(h33, "font-weight", /*fontWeight*/ ctx[5]);
    			add_location(h33, file$9, 91, 2, 2645);
    			attr_dev(fieldset, "class", "settings__fieldset svelte-nrlmcn");
    			set_style(fieldset, "font-family", "var(--font-family)");
    			add_location(fieldset, file$9, 92, 2, 2750);
    			attr_dev(div3, "class", "settings__field svelte-nrlmcn");
    			add_location(div3, file$9, 90, 1, 2612);
    			attr_dev(span2, "class", "svelte-nrlmcn");
    			add_location(span2, file$9, 99, 35, 3077);
    			attr_dev(h34, "class", "setting__title svelte-nrlmcn");
    			add_location(h34, file$9, 99, 2, 3044);
    			attr_dev(div4, "class", "settings__field svelte-nrlmcn");
    			add_location(div4, file$9, 98, 1, 3011);
    			attr_dev(div5, "class", "settings popup");
    			add_location(div5, file$9, 40, 0, 1074);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			mount_component(activebook, div5, null);
    			append_dev(div5, t0);
    			append_dev(div5, div0);
    			append_dev(div0, h30);
    			append_dev(h30, t1);
    			append_dev(h30, span0);
    			append_dev(span0, t2);
    			append_dev(span0, t3);
    			append_dev(span0, t4);
    			append_dev(div0, t5);
    			mount_component(range0, div0, null);
    			append_dev(div0, t6);
    			mount_component(range1, div0, null);
    			append_dev(div5, t7);
    			append_dev(div5, div1);
    			append_dev(div1, h31);
    			append_dev(h31, t8);
    			append_dev(h31, br);
    			append_dev(h31, t9);
    			append_dev(div1, t10);
    			mount_component(select0, div1, null);
    			append_dev(div5, t11);
    			append_dev(div5, div2);
    			append_dev(div2, h32);
    			append_dev(div2, t13);
    			mount_component(select1, div2, null);
    			append_dev(div5, t14);
    			append_dev(div5, div3);
    			append_dev(div3, h33);
    			append_dev(h33, t15);
    			append_dev(h33, span1);
    			append_dev(span1, t16);
    			append_dev(div3, t17);
    			append_dev(div3, fieldset);

    			for (let i = 0; i < 4; i += 1) {
    				each_blocks[i].m(fieldset, null);
    			}

    			append_dev(div5, t18);
    			append_dev(div5, div4);
    			append_dev(div4, h34);
    			append_dev(h34, t19);
    			append_dev(h34, span2);
    			append_dev(span2, t20);
    			append_dev(div4, t21);
    			mount_component(range2, div4, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*_width*/ 2) set_data_dev(t2, /*_width*/ ctx[1]);
    			if ((!current || dirty & /*_height*/ 8) && t4_value !== (t4_value = /*_height*/ ctx[3] * 2 + "")) set_data_dev(t4, t4_value);
    			const range0_changes = {};

    			if (!updating_value && dirty & /*width*/ 4) {
    				updating_value = true;
    				range0_changes.value = /*width*/ ctx[2];
    				add_flush_callback(() => updating_value = false);
    			}

    			if (!updating__value && dirty & /*_width*/ 2) {
    				updating__value = true;
    				range0_changes._value = /*_width*/ ctx[1];
    				add_flush_callback(() => updating__value = false);
    			}

    			range0.$set(range0_changes);
    			const range1_changes = {};
    			if (dirty & /*fontSize*/ 128) range1_changes.max = Math.floor(window.innerHeight / (/*fontSize*/ ctx[7] * 2 * 1.25));

    			if (!updating_value_1 && dirty & /*height*/ 16) {
    				updating_value_1 = true;
    				range1_changes.value = /*height*/ ctx[4];
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			if (!updating__value_1 && dirty & /*_height*/ 8) {
    				updating__value_1 = true;
    				range1_changes._value = /*_height*/ ctx[3];
    				add_flush_callback(() => updating__value_1 = false);
    			}

    			range1.$set(range1_changes);
    			const select0_changes = {};

    			if (dirty & /*$$scope*/ 2097152) {
    				select0_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_2 && dirty & /*scheme*/ 1) {
    				updating_value_2 = true;
    				select0_changes.value = /*scheme*/ ctx[0];
    				add_flush_callback(() => updating_value_2 = false);
    			}

    			select0.$set(select0_changes);
    			const select1_changes = {};

    			if (dirty & /*$$scope*/ 2097152) {
    				select1_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_value_3 && dirty & /*fontFamily*/ 64) {
    				updating_value_3 = true;
    				select1_changes.value = /*fontFamily*/ ctx[6];
    				add_flush_callback(() => updating_value_3 = false);
    			}

    			select1.$set(select1_changes);
    			if (!current || dirty & /*fontWeight*/ 32) set_data_dev(t16, /*fontWeight*/ ctx[5]);

    			if (!current || dirty & /*fontWeight*/ 32) {
    				set_style(h33, "font-weight", /*fontWeight*/ ctx[5]);
    			}

    			if (dirty & /*fontWeight*/ 32) {
    				each_value = [300, 400, 600, 700];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < 4; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(fieldset, null);
    					}
    				}

    				group_outros();

    				for (i = 4; i < 4; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*fontSize*/ 128) set_data_dev(t20, /*fontSize*/ ctx[7]);
    			const range2_changes = {};

    			if (!updating_value_4 && dirty & /*fontSize*/ 128) {
    				updating_value_4 = true;
    				range2_changes.value = /*fontSize*/ ctx[7];
    				add_flush_callback(() => updating_value_4 = false);
    			}

    			range2.$set(range2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(activebook.$$.fragment, local);
    			transition_in(range0.$$.fragment, local);
    			transition_in(range1.$$.fragment, local);
    			transition_in(select0.$$.fragment, local);
    			transition_in(select1.$$.fragment, local);

    			for (let i = 0; i < 4; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(range2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(activebook.$$.fragment, local);
    			transition_out(range0.$$.fragment, local);
    			transition_out(range1.$$.fragment, local);
    			transition_out(select0.$$.fragment, local);
    			transition_out(select1.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < 4; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(range2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			destroy_component(activebook);
    			destroy_component(range0);
    			destroy_component(range1);
    			destroy_component(select0);
    			destroy_component(select1);
    			destroy_each(each_blocks, detaching);
    			destroy_component(range2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Settings', slots, []);

    	let scheme = theme.get("scheme"),
    		_width = theme.get("book-width-tmp"),
    		width = theme.get("book-width"),
    		_height = theme.get("book-height-tmp"),
    		height = theme.get("book-height"),
    		fontWeight = theme.get("font-weight"),
    		fontFamily = theme.get("font-family"),
    		fontSize = theme.get("font-size");

    	const change = event => {
    		event.detail;
    		document.body.classList.remove("size-changing");
    	};

    	const input = event => {
    		event.detail;
    		document.body.classList.add("size-changing");
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Settings> was created with unknown prop '${key}'`);
    	});

    	function range0_value_binding(value) {
    		width = value;
    		$$invalidate(2, width);
    	}

    	function range0__value_binding(value) {
    		_width = value;
    		$$invalidate(1, _width);
    	}

    	function range1_value_binding(value) {
    		height = value;
    		$$invalidate(4, height);
    	}

    	function range1__value_binding(value) {
    		_height = value;
    		$$invalidate(3, _height);
    	}

    	function select0_value_binding(value) {
    		scheme = value;
    		$$invalidate(0, scheme);
    	}

    	function select1_value_binding(value) {
    		fontFamily = value;
    		$$invalidate(6, fontFamily);
    	}

    	function radio_group_binding(value) {
    		fontWeight = value;
    		$$invalidate(5, fontWeight);
    	}

    	function range2_value_binding(value) {
    		fontSize = value;
    		$$invalidate(7, fontSize);
    	}

    	$$self.$capture_state = () => ({
    		theme,
    		Range,
    		Radio,
    		Select,
    		ActiveBook: Active_book,
    		scheme,
    		_width,
    		width,
    		_height,
    		height,
    		fontWeight,
    		fontFamily,
    		fontSize,
    		change,
    		input
    	});

    	$$self.$inject_state = $$props => {
    		if ('scheme' in $$props) $$invalidate(0, scheme = $$props.scheme);
    		if ('_width' in $$props) $$invalidate(1, _width = $$props._width);
    		if ('width' in $$props) $$invalidate(2, width = $$props.width);
    		if ('_height' in $$props) $$invalidate(3, _height = $$props._height);
    		if ('height' in $$props) $$invalidate(4, height = $$props.height);
    		if ('fontWeight' in $$props) $$invalidate(5, fontWeight = $$props.fontWeight);
    		if ('fontFamily' in $$props) $$invalidate(6, fontFamily = $$props.fontFamily);
    		if ('fontSize' in $$props) $$invalidate(7, fontSize = $$props.fontSize);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*scheme*/ 1) {
    			theme.add("scheme", scheme);
    		}

    		if ($$self.$$.dirty & /*width*/ 4) {
    			theme.add("book-width", width);
    		}

    		if ($$self.$$.dirty & /*_width*/ 2) {
    			theme.add("book-width-tmp", _width);
    		}

    		if ($$self.$$.dirty & /*_height*/ 8) {
    			theme.add("book-height-tmp", _height);
    		}

    		if ($$self.$$.dirty & /*height*/ 16) {
    			theme.add("book-height", height);
    		}

    		if ($$self.$$.dirty & /*fontWeight*/ 32) {
    			theme.add("font-weight", fontWeight);
    		}

    		if ($$self.$$.dirty & /*fontFamily*/ 64) {
    			theme.add("font-family", fontFamily);
    		}

    		if ($$self.$$.dirty & /*fontSize*/ 128) {
    			theme.add("font-size", fontSize);
    		}
    	};

    	return [
    		scheme,
    		_width,
    		width,
    		_height,
    		height,
    		fontWeight,
    		fontFamily,
    		fontSize,
    		change,
    		input,
    		range0_value_binding,
    		range0__value_binding,
    		range1_value_binding,
    		range1__value_binding,
    		select0_value_binding,
    		select1_value_binding,
    		radio_group_binding,
    		range2_value_binding
    	];
    }

    class Settings extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Settings",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src\components\chapters.svelte generated by Svelte v3.42.3 */
    const file$8 = "src\\components\\chapters.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (14:0) {#if book && book.inited && book.chapters.length}
    function create_if_block$2(ctx) {
    	let div;
    	let h2;
    	let t0_value = /*book*/ ctx[0].title + "";
    	let t0;
    	let t1;
    	let ul;
    	let each_value = /*book*/ ctx[0].chapters;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			t0 = text(t0_value);
    			t1 = space();
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(h2, "class", "svelte-xednov");
    			add_location(h2, file$8, 15, 1, 262);
    			attr_dev(ul, "class", "chapters__list svelte-xednov");
    			add_location(ul, file$8, 16, 1, 288);
    			attr_dev(div, "class", "chapters popup");
    			add_location(div, file$8, 14, 0, 231);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(h2, t0);
    			append_dev(div, t1);
    			append_dev(div, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*book*/ 1 && t0_value !== (t0_value = /*book*/ ctx[0].title + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*show, book*/ 3) {
    				each_value = /*book*/ ctx[0].chapters;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(14:0) {#if book && book.inited && book.chapters.length}",
    		ctx
    	});

    	return block;
    }

    // (18:1) {#each book.chapters as chapter}
    function create_each_block$2(ctx) {
    	let li;
    	let button;
    	let t0_value = /*chapter*/ ctx[3].innerText + "";
    	let t0;
    	let t1;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			li = element("li");
    			button = element("button");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(button, "class", "chapters__btn svelte-xednov");
    			add_location(button, file$8, 19, 3, 386);
    			attr_dev(li, "class", "chapters__item");
    			add_location(li, file$8, 18, 2, 354);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, button);
    			append_dev(button, t0);
    			append_dev(li, t1);

    			if (!mounted) {
    				dispose = listen_dev(
    					button,
    					"click",
    					function () {
    						if (is_function(/*show*/ ctx[1].bind(/*chapter*/ ctx[3]))) /*show*/ ctx[1].bind(/*chapter*/ ctx[3]).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*book*/ 1 && t0_value !== (t0_value = /*chapter*/ ctx[3].innerText + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(18:1) {#each book.chapters as chapter}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let if_block_anchor;
    	let if_block = /*book*/ ctx[0] && /*book*/ ctx[0].inited && /*book*/ ctx[0].chapters.length && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*book*/ ctx[0] && /*book*/ ctx[0].inited && /*book*/ ctx[0].chapters.length) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let $books;
    	validate_store(books, 'books');
    	component_subscribe($$self, books, $$value => $$invalidate(2, $books = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Chapters', slots, []);
    	let book;

    	function show() {
    		book.showChapter(this);
    		$$invalidate(0, book.chapter = this, book);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Chapters> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ books, book, show, $books });

    	$$self.$inject_state = $$props => {
    		if ('book' in $$props) $$invalidate(0, book = $$props.book);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$books*/ 4) {
    			$$invalidate(0, book = $books.list[$books.active]);
    		}
    	};

    	return [book, show, $books];
    }

    class Chapters extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Chapters",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    /* src\components\header\header.svelte generated by Svelte v3.42.3 */
    const file$7 = "src\\components\\header\\header.svelte";

    function create_fragment$9(ctx) {
    	let header;
    	let div0;
    	let leftcontroll;
    	let t0;
    	let div1;
    	let rightcontroll;
    	let t1;
    	let div2;
    	let setting;
    	let t2;
    	let div3;
    	let chapters;
    	let current;
    	leftcontroll = new Left_controll({ $$inline: true });
    	rightcontroll = new Right_controll({ $$inline: true });
    	setting = new Settings({ $$inline: true });
    	chapters = new Chapters({ $$inline: true });

    	const block = {
    		c: function create() {
    			header = element("header");
    			div0 = element("div");
    			create_component(leftcontroll.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			create_component(rightcontroll.$$.fragment);
    			t1 = space();
    			div2 = element("div");
    			create_component(setting.$$.fragment);
    			t2 = space();
    			div3 = element("div");
    			create_component(chapters.$$.fragment);
    			attr_dev(div0, "class", "header__controls svelte-1q5vita");
    			add_location(div0, file$7, 8, 1, 238);
    			attr_dev(div1, "class", "header__controls svelte-1q5vita");
    			add_location(div1, file$7, 9, 1, 293);
    			attr_dev(div2, "class", "header__settings popup-wrapper");
    			add_location(div2, file$7, 11, 1, 351);
    			attr_dev(div3, "class", "header__chapters popup-wrapper");
    			add_location(div3, file$7, 14, 1, 422);
    			attr_dev(header, "class", "header svelte-1q5vita");
    			add_location(header, file$7, 7, 0, 212);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, div0);
    			mount_component(leftcontroll, div0, null);
    			append_dev(header, t0);
    			append_dev(header, div1);
    			mount_component(rightcontroll, div1, null);
    			append_dev(header, t1);
    			append_dev(header, div2);
    			mount_component(setting, div2, null);
    			append_dev(header, t2);
    			append_dev(header, div3);
    			mount_component(chapters, div3, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(leftcontroll.$$.fragment, local);
    			transition_in(rightcontroll.$$.fragment, local);
    			transition_in(setting.$$.fragment, local);
    			transition_in(chapters.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(leftcontroll.$$.fragment, local);
    			transition_out(rightcontroll.$$.fragment, local);
    			transition_out(setting.$$.fragment, local);
    			transition_out(chapters.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			destroy_component(leftcontroll);
    			destroy_component(rightcontroll);
    			destroy_component(setting);
    			destroy_component(chapters);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Header', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Header> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		LeftControll: Left_controll,
    		RightControll: Right_controll,
    		Setting: Settings,
    		Chapters
    	});

    	return [];
    }

    class Header extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Header",
    			options,
    			id: create_fragment$9.name
    		});
    	}
    }

    /* src\components\screen\screen.svelte generated by Svelte v3.42.3 */
    const file$6 = "src\\components\\screen\\screen.svelte";

    function create_fragment$8(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();

    			attr_dev(div, "class", div_class_value = "screen screen--" + /*name*/ ctx[0] + " " + (/*name*/ ctx[0] == /*$screen*/ ctx[1].active
    			? 'screen--active'
    			: '') + " svelte-1pwbfoa");

    			add_location(div, file$6, 5, 0, 78);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 4)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[2],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[2])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*name, $screen*/ 3 && div_class_value !== (div_class_value = "screen screen--" + /*name*/ ctx[0] + " " + (/*name*/ ctx[0] == /*$screen*/ ctx[1].active
    			? 'screen--active'
    			: '') + " svelte-1pwbfoa")) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let $screen;
    	validate_store(screen, 'screen');
    	component_subscribe($$self, screen, $$value => $$invalidate(1, $screen = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Screen', slots, ['default']);
    	let { name } = $$props;
    	const writable_props = ['name'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Screen> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    		if ('$$scope' in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ screen, name, $screen });

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) $$invalidate(0, name = $$props.name);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [name, $screen, $$scope, slots];
    }

    class Screen extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { name: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Screen",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*name*/ ctx[0] === undefined && !('name' in props)) {
    			console.warn("<Screen> was created without expected prop 'name'");
    		}
    	}

    	get name() {
    		throw new Error("<Screen>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<Screen>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    class Book$1 {
    	constructor(id) {
    		this.id = id;

    		this.chapters = [];
    		this.progress = this._getFromLocalStorage().progress || 0;
    	}

    	open() {
    		setTimeout(() => {
    			const element = this.element.parentNode;
    			element.scrollTop = this.progress * this.element.offsetHeight;
    		}, 1);
    	}

    	_getFromLocalStorage() {
    		const localBooks = localStorage.getItem("books") ?? "{}";
    		const books = JSON.parse(localBooks);
    		if (!books[this.id])
    			books[this.id] = {};
    		return books[this.id]
    	}
    	_saveToLocalStorage(book) {
    		const localBooks = localStorage.getItem("books") ?? "{}";
    		const books = JSON.parse(localBooks);
    		books[this.id] = book;
    		const jsonBooks = JSON.stringify(books);
    		localStorage.setItem("books", jsonBooks);
    	}

    	scrollToChapter(chapter) {}

    	_curentChapter(top) {
    		let chapter;
    		for (const i in this.chapters) {
    			const h3 = this.chapters[i];
    			if (h3.offsetTop > top) {
    				if (i == 0)
    					chapter = this.chapters[0];
    				else
    					chapter = this.chapters[i - 1];
    				break
    			}
    		}

    		this.chapter = chapter || this.chapters[this.chapters.length - 1];
    	}

    	setProgress(top, height) {
    		this.progress = top / height;

    		if (!this.chapters.length)
    			return

    		this._curentChapter(top);
    	}

    	set progress(value) {
    		this._progress = value;
    		const book = this._getFromLocalStorage();
    		book.progress = value;
    		this._saveToLocalStorage(book);
    	}
    	get progress() {
    		return this._progress
    	}
    }

    const replaceTags = {
    	v: "p",
    	poem: "div",
    	stanza: "div",
    	emphasis: "em",
    	description: "div",
    	"empty-line": "br",
    	epigraph: "div",
    	"text-author": "p",
    	cite: "div"
    };

    class FB2 extends Book$1 {
    	constructor(xml, id) {
    		super(id);
    		this.data = xml;
    		this.element = this.bookFromXML(xml);
    		this.author = this._getAuthor();
    		this.cover = this._getCover();
    		this.title = this._getTitle();
    	}

    	bookFromXML(xml) {
    		const el = document.createElement("div");
    		el.innerHTML = xml;
    		el.innerHTML = el.querySelector("fictionbook").innerHTML;
    		el.className = "book__container";
    		el.dataset.book = this.id;
    		this._headings(el);
    		this._tags(el);
    		return el
    	}

    	_getAuthor() {
    		const author = this.element.querySelector("author");
    		return Array.from(author.children).map(el => el.innerText).join(" ")
    	}
    	_getTitle() {
    		return this.element.querySelector("book-title").innerText
    	}
    	_getCover() {
    		const cover = this.element.querySelector('binary[id="cover.jpg"]');
    		if (!cover)
    			return null

    		const _cover = `data:${cover.getAttribute("content-type")};base64,${cover.innerHTML}`;
    		cover.remove();
    		return _cover
    	}

    	_headings(el) {
    		el.querySelectorAll("title").forEach(title => {
    			const tags = [
    				"section"
    			];
    			const tagName = "h" + parseInt(tags.indexOf(
    				title.parentElement.tagName.toLocaleLowerCase()
    			) + 3);
    			const heading = document.createElement(tagName);
    			heading.innerHTML = title.innerText.trim();

    			if (tagName == "h3")
    				heading.innerHTML = heading.innerText.trim();
    			else
    				heading.innerHTML = heading.innerText;

    			title.replaceWith(heading);
    		});

    		this.chapters = el.querySelectorAll("h3");
    	}
    	_tags(el) {
    		Object.entries(replaceTags).forEach(([tag, selector]) => {
    			const selectorList = selector.split(".");
    			el.querySelectorAll(tag).forEach(_el => {
    				const element = document.createElement(selectorList[0]);
    				element.className = tag;
    				element.innerHTML = _el.innerHTML;
    				_el.replaceWith(element);
    			});
    		});
    	}
    }

    /* src\components\book\book.svelte generated by Svelte v3.42.3 */
    const file$5 = "src\\components\\book\\book.svelte";

    function create_fragment$7(ctx) {
    	let article;
    	let div0;
    	let t0;
    	let div1;
    	let t1;
    	let div2;
    	let article_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			article = element("article");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			t1 = space();
    			div2 = element("div");
    			attr_dev(div0, "class", "book__page svelte-1uxbrw8");
    			add_location(div0, file$5, 39, 1, 891);
    			attr_dev(div1, "class", "book__border book__border--top svelte-1uxbrw8");
    			add_location(div1, file$5, 40, 1, 924);
    			attr_dev(div2, "class", "book__border book__border--bottom svelte-1uxbrw8");
    			add_location(div2, file$5, 41, 1, 977);

    			attr_dev(article, "class", article_class_value = "book " + (/*$books*/ ctx[2].active == /*id*/ ctx[0]
    			? "book--active"
    			: "") + " svelte-1uxbrw8");

    			set_style(article, "--line-height", /*lineHeight*/ ctx[3]);
    			add_location(article, file$5, 33, 0, 728);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, div0);
    			append_dev(article, t0);
    			append_dev(article, div1);
    			append_dev(article, t1);
    			append_dev(article, div2);
    			/*article_binding*/ ctx[7](article);

    			if (!mounted) {
    				dispose = listen_dev(article, "scroll", /*scroll*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$books, id*/ 5 && article_class_value !== (article_class_value = "book " + (/*$books*/ ctx[2].active == /*id*/ ctx[0]
    			? "book--active"
    			: "") + " svelte-1uxbrw8")) {
    				attr_dev(article, "class", article_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    			/*article_binding*/ ctx[7](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let $theme;
    	let $books;
    	validate_store(theme, 'theme');
    	component_subscribe($$self, theme, $$value => $$invalidate(8, $theme = $$value));
    	validate_store(books, 'books');
    	component_subscribe($$self, books, $$value => $$invalidate(2, $books = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Book', slots, []);
    	let { id } = $$props;
    	let book, _book, element;
    	let lineHeight = 1.25;

    	const showChapter = chapter => {
    		const offsetTop = window.innerHeight - $theme["book-height"] * 2 * $theme["font-size"] * lineHeight;
    		$$invalidate(1, element.scrollTop = chapter.offsetTop - offsetTop / 2, element);
    	};

    	function scroll() {
    		book.setProgress(element.scrollTop, element.scrollHeight);
    		books.add(id, book);
    	}

    	const writable_props = ['id'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Book> was created with unknown prop '${key}'`);
    	});

    	function article_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(1, element);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    	};

    	$$self.$capture_state = () => ({
    		books,
    		theme,
    		FB2,
    		id,
    		book,
    		_book,
    		element,
    		lineHeight,
    		showChapter,
    		scroll,
    		$theme,
    		$books
    	});

    	$$self.$inject_state = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('book' in $$props) $$invalidate(5, book = $$props.book);
    		if ('_book' in $$props) $$invalidate(6, _book = $$props._book);
    		if ('element' in $$props) $$invalidate(1, element = $$props.element);
    		if ('lineHeight' in $$props) $$invalidate(3, lineHeight = $$props.lineHeight);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$books, id, _book, element, book*/ 103) {
    			{
    				$$invalidate(6, _book = $books.list[id]);

    				if (_book && element && !_book.inited) {
    					$$invalidate(5, book = new FB2(_book.data, id));
    					$$invalidate(5, book.showChapter = showChapter, book);
    					$$invalidate(5, book.inited = true, book);
    					books.add(id, book);
    					element.appendChild(book.element);
    					book.open();
    				}
    			}
    		}
    	};

    	return [id, element, $books, lineHeight, scroll, book, _book, article_binding];
    }

    class Book extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, { id: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Book",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*id*/ ctx[0] === undefined && !('id' in props)) {
    			console.warn("<Book> was created without expected prop 'id'");
    		}
    	}

    	get id() {
    		throw new Error("<Book>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Book>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\screen\book-screen.svelte generated by Svelte v3.42.3 */

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	return child_ctx;
    }

    // (14:1) {#each list as id (id)}
    function create_each_block$1(key_1, ctx) {
    	let first;
    	let book;
    	let current;

    	book = new Book({
    			props: { id: /*id*/ ctx[2] },
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			first = empty();
    			create_component(book.$$.fragment);
    			this.first = first;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, first, anchor);
    			mount_component(book, target, anchor);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const book_changes = {};
    			if (dirty & /*list*/ 1) book_changes.id = /*id*/ ctx[2];
    			book.$set(book_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(book.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(book.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(first);
    			destroy_component(book, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(14:1) {#each list as id (id)}",
    		ctx
    	});

    	return block;
    }

    // (13:0) <Screen name="book">
    function create_default_slot$1(ctx) {
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let each_1_anchor;
    	let current;
    	let each_value = /*list*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*id*/ ctx[2];
    	validate_each_keys(ctx, each_value, get_each_context$1, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$1(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*list*/ 1) {
    				each_value = /*list*/ ctx[0];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, each_1_anchor.parentNode, outro_and_destroy_block, create_each_block$1, each_1_anchor, get_each_context$1);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d(detaching);
    			}

    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(13:0) <Screen name=\\\"book\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let screen;
    	let current;

    	screen = new Screen({
    			props: {
    				name: "book",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(screen.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(screen, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const screen_changes = {};

    			if (dirty & /*$$scope, list*/ 33) {
    				screen_changes.$$scope = { dirty, ctx };
    			}

    			screen.$set(screen_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(screen.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(screen.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(screen, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let $books;
    	validate_store(books, 'books');
    	component_subscribe($$self, books, $$value => $$invalidate(1, $books = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Book_screen', slots, []);
    	let list = [];
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Book_screen> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Screen, Book, books, list, $books });

    	$$self.$inject_state = $$props => {
    		if ('list' in $$props) $$invalidate(0, list = $$props.list);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$books*/ 2) {
    			{
    				if ($books.listId) $$invalidate(0, list = $books.listId);
    			}
    		}
    	};

    	return [list, $books];
    }

    class Book_screen extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Book_screen",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src\components\book\book-preview.svelte generated by Svelte v3.42.3 */
    const file$4 = "src\\components\\book\\book-preview.svelte";

    // (26:0) {#if book && book.inited}
    function create_if_block$1(ctx) {
    	let article;
    	let div2;
    	let h3;
    	let t0;
    	let t1;
    	let p;
    	let t2;
    	let t3;
    	let div1;
    	let t4_value = Math.floor(/*progress*/ ctx[4] * 10) / 10 + "";
    	let t4;
    	let t5;
    	let div0;
    	let t6;
    	let mounted;
    	let dispose;
    	let if_block = /*cover*/ ctx[5] && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			article = element("article");
    			div2 = element("div");
    			h3 = element("h3");
    			t0 = text(/*title*/ ctx[2]);
    			t1 = space();
    			p = element("p");
    			t2 = text(/*author*/ ctx[3]);
    			t3 = space();
    			div1 = element("div");
    			t4 = text(t4_value);
    			t5 = text("%\r\n\t\t\t\t");
    			div0 = element("div");
    			t6 = space();
    			if (if_block) if_block.c();
    			attr_dev(h3, "class", "book-preview__title svelte-1eod96l");
    			add_location(h3, file$4, 28, 3, 546);
    			attr_dev(p, "class", "book-preview__author svelte-1eod96l");
    			add_location(p, file$4, 29, 3, 595);
    			attr_dev(div0, "class", "progress__bar svelte-1eod96l");
    			add_location(div0, file$4, 32, 4, 757);
    			attr_dev(div1, "class", "book-preview__progress svelte-1eod96l");
    			set_style(div1, "--progress", /*progress*/ ctx[4] + "%");
    			add_location(div1, file$4, 30, 3, 644);
    			attr_dev(div2, "class", "book-preview__description svelte-1eod96l");
    			add_location(div2, file$4, 27, 2, 502);
    			attr_dev(article, "class", "book-preview svelte-1eod96l");
    			attr_dev(article, "data-book", /*id*/ ctx[0]);
    			add_location(article, file$4, 26, 1, 425);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			append_dev(article, div2);
    			append_dev(div2, h3);
    			append_dev(h3, t0);
    			append_dev(div2, t1);
    			append_dev(div2, p);
    			append_dev(p, t2);
    			append_dev(div2, t3);
    			append_dev(div2, div1);
    			append_dev(div1, t4);
    			append_dev(div1, t5);
    			append_dev(div1, div0);
    			append_dev(article, t6);
    			if (if_block) if_block.m(article, null);

    			if (!mounted) {
    				dispose = listen_dev(article, "click", /*clickHandler*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*title*/ 4) set_data_dev(t0, /*title*/ ctx[2]);
    			if (dirty & /*author*/ 8) set_data_dev(t2, /*author*/ ctx[3]);
    			if (dirty & /*progress*/ 16 && t4_value !== (t4_value = Math.floor(/*progress*/ ctx[4] * 10) / 10 + "")) set_data_dev(t4, t4_value);

    			if (dirty & /*progress*/ 16) {
    				set_style(div1, "--progress", /*progress*/ ctx[4] + "%");
    			}

    			if (/*cover*/ ctx[5]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					if_block.m(article, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*id*/ 1) {
    				attr_dev(article, "data-book", /*id*/ ctx[0]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(26:0) {#if book && book.inited}",
    		ctx
    	});

    	return block;
    }

    // (37:2) {#if cover}
    function create_if_block_1(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			attr_dev(img, "class", "book-preview__cover svelte-1eod96l");
    			if (!src_url_equal(img.src, img_src_value = /*cover*/ ctx[5])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*title*/ ctx[2]);
    			add_location(img, file$4, 37, 3, 833);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*cover*/ 32 && !src_url_equal(img.src, img_src_value = /*cover*/ ctx[5])) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*title*/ 4) {
    				attr_dev(img, "alt", /*title*/ ctx[2]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(37:2) {#if cover}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let if_block_anchor;
    	let if_block = /*book*/ ctx[1] && /*book*/ ctx[1].inited && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*book*/ ctx[1] && /*book*/ ctx[1].inited) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $books;
    	validate_store(books, 'books');
    	component_subscribe($$self, books, $$value => $$invalidate(7, $books = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Book_preview', slots, []);
    	let { id } = $$props;
    	let book;
    	let title, author, progress, cover;

    	const clickHandler = e => {
    		screen.active = "book";
    		books.active = id;
    		book.open();
    	};

    	const writable_props = ['id'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Book_preview> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    	};

    	$$self.$capture_state = () => ({
    		books,
    		screen,
    		id,
    		book,
    		title,
    		author,
    		progress,
    		cover,
    		clickHandler,
    		$books
    	});

    	$$self.$inject_state = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    		if ('book' in $$props) $$invalidate(1, book = $$props.book);
    		if ('title' in $$props) $$invalidate(2, title = $$props.title);
    		if ('author' in $$props) $$invalidate(3, author = $$props.author);
    		if ('progress' in $$props) $$invalidate(4, progress = $$props.progress);
    		if ('cover' in $$props) $$invalidate(5, cover = $$props.cover);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$books, id, book*/ 131) {
    			{
    				$$invalidate(1, book = $books.list[id]);

    				if (book && book.inited) {
    					$$invalidate(2, title = book.title);
    					$$invalidate(3, author = book.author);
    					$$invalidate(4, progress = book.progress * 100);
    					$$invalidate(5, cover = book.cover);
    				}
    			}
    		}
    	};

    	return [id, book, title, author, progress, cover, clickHandler, $books];
    }

    class Book_preview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, { id: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Book_preview",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*id*/ ctx[0] === undefined && !('id' in props)) {
    			console.warn("<Book_preview> was created without expected prop 'id'");
    		}
    	}

    	get id() {
    		throw new Error("<Book_preview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Book_preview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\book\book-list.svelte generated by Svelte v3.42.3 */
    const file$3 = "src\\components\\book\\book-list.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (6:1) {#each list as id (id)}
    function create_each_block(key_1, ctx) {
    	let li;
    	let bookpreview;
    	let current;

    	bookpreview = new Book_preview({
    			props: { id: /*id*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			li = element("li");
    			create_component(bookpreview.$$.fragment);
    			add_location(li, file$3, 6, 2, 139);
    			this.first = li;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			mount_component(bookpreview, li, null);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const bookpreview_changes = {};
    			if (dirty & /*list*/ 1) bookpreview_changes.id = /*id*/ ctx[1];
    			bookpreview.$set(bookpreview_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(bookpreview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(bookpreview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_component(bookpreview);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(6:1) {#each list as id (id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let ul;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = /*list*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*id*/ ctx[1];
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "book-list svelte-198p58u");
    			add_location(ul, file$3, 4, 0, 87);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*list*/ 1) {
    				each_value = /*list*/ ctx[0];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, ul, outro_and_destroy_block, create_each_block, null, get_each_context);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Book_list', slots, []);
    	let { list } = $$props;
    	const writable_props = ['list'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Book_list> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('list' in $$props) $$invalidate(0, list = $$props.list);
    	};

    	$$self.$capture_state = () => ({ BookPreview: Book_preview, list });

    	$$self.$inject_state = $$props => {
    		if ('list' in $$props) $$invalidate(0, list = $$props.list);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [list];
    }

    class Book_list extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, { list: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Book_list",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*list*/ ctx[0] === undefined && !('list' in props)) {
    			console.warn("<Book_list> was created without expected prop 'list'");
    		}
    	}

    	get list() {
    		throw new Error("<Book_list>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set list(value) {
    		throw new Error("<Book_list>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\components\book\book-select.svelte generated by Svelte v3.42.3 */
    const file$2 = "src\\components\\book\\book-select.svelte";

    function create_fragment$3(ctx) {
    	let div;
    	let label;
    	let h1;
    	let t1;
    	let input;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			label = element("label");
    			h1 = element("h1");
    			h1.textContent = "Выберите файлы";
    			t1 = space();
    			input = element("input");
    			attr_dev(h1, "class", "drag__title svelte-1q8bbyc");
    			add_location(h1, file$2, 26, 2, 387);
    			attr_dev(input, "type", "file");
    			input.multiple = true;
    			attr_dev(input, "class", "drag__input svelte-1q8bbyc");
    			add_location(input, file$2, 27, 2, 434);
    			attr_dev(label, "class", "drag svelte-1q8bbyc");
    			add_location(label, file$2, 23, 1, 358);
    			attr_dev(div, "class", "wrapper svelte-1q8bbyc");
    			add_location(div, file$2, 22, 0, 334);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, label);
    			append_dev(label, h1);
    			append_dev(label, t1);
    			append_dev(label, input);

    			if (!mounted) {
    				dispose = listen_dev(input, "input", /*input_handler*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Book_select', slots, []);

    	function submit(files) {
    		for (const file of files) {
    			const reader = new FileReader();
    			const id = file.name;
    			reader.readAsText(file);

    			reader.onload = e => {
    				const data = reader.result;
    				books.add(id, { data, inited: false });
    			};
    		}
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Book_select> was created with unknown prop '${key}'`);
    	});

    	const input_handler = e => submit(e.target.files);
    	$$self.$capture_state = () => ({ books, submit });
    	return [submit, input_handler];
    }

    class Book_select extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Book_select",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src\components\dropper.svelte generated by Svelte v3.42.3 */

    const file$1 = "src\\components\\dropper.svelte";

    function create_fragment$2(ctx) {
    	let div1;
    	let div0;
    	let h1;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Drop";
    			add_location(h1, file$1, 3, 2, 57);
    			attr_dev(div0, "class", "dropper__area svelte-ci4cx1");
    			add_location(div0, file$1, 2, 1, 26);
    			attr_dev(div1, "class", "dropper svelte-ci4cx1");
    			add_location(div1, file$1, 1, 0, 2);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, h1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Dropper', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Dropper> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Dropper extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dropper",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\components\screen\home-screen.svelte generated by Svelte v3.42.3 */

    const { document: document_1 } = globals;

    // (49:1) {:else}
    function create_else_block(ctx) {
    	let bookselect;
    	let current;
    	bookselect = new Book_select({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(bookselect.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(bookselect, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(bookselect.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(bookselect.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(bookselect, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(49:1) {:else}",
    		ctx
    	});

    	return block;
    }

    // (46:1) {#if $books.listId}
    function create_if_block(ctx) {
    	let booklist;
    	let t;
    	let dropper;
    	let current;

    	booklist = new Book_list({
    			props: { list: /*$books*/ ctx[0].listId },
    			$$inline: true
    		});

    	dropper = new Dropper({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(booklist.$$.fragment);
    			t = space();
    			create_component(dropper.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(booklist, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(dropper, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const booklist_changes = {};
    			if (dirty & /*$books*/ 1) booklist_changes.list = /*$books*/ ctx[0].listId;
    			booklist.$set(booklist_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(booklist.$$.fragment, local);
    			transition_in(dropper.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(booklist.$$.fragment, local);
    			transition_out(dropper.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(booklist, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(dropper, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(46:1) {#if $books.listId}",
    		ctx
    	});

    	return block;
    }

    // (45:0) <Screen name="home">
    function create_default_slot(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$books*/ ctx[0].listId) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(45:0) <Screen name=\\\"home\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let t;
    	let screen;
    	let current;
    	let mounted;
    	let dispose;

    	screen = new Screen({
    			props: {
    				name: "home",
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			t = space();
    			create_component(screen.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    			mount_component(screen, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(document_1.body, "dragover", prevent_default(dragover), false, true, false),
    					listen_dev(document_1.body, "dragleave", prevent_default(dragleave), false, true, false),
    					listen_dev(document_1.body, "drop", prevent_default(/*drop*/ ctx[1]), false, true, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const screen_changes = {};

    			if (dirty & /*$$scope, $books*/ 9) {
    				screen_changes.$$scope = { dirty, ctx };
    			}

    			screen.$set(screen_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(screen.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(screen.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    			destroy_component(screen, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function dragover() {
    	document.body.classList.add("drag--active");
    }

    function dragleave() {
    	document.body.classList.remove("drag--active");
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $books;
    	validate_store(books, 'books');
    	component_subscribe($$self, books, $$value => $$invalidate(0, $books = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Home_screen', slots, []);

    	function submit(files) {
    		for (const file of files) {
    			const reader = new FileReader();
    			const id = file.name;
    			reader.readAsText(file);

    			reader.onload = e => {
    				const data = reader.result;
    				books.add(id, { data, inited: false });
    			};
    		}
    	}

    	function drop(e) {
    		document.body.classList.remove("drag--active");
    		submit(e.dataTransfer.files);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Home_screen> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Screen,
    		BookList: Book_list,
    		BookSelect: Book_select,
    		Dropper,
    		books,
    		submit,
    		dragover,
    		dragleave,
    		drop,
    		$books
    	});

    	return [$books, drop];
    }

    class Home_screen extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home_screen",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.42.3 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let header;
    	let t0;
    	let homescreen;
    	let t1;
    	let bookscreen;
    	let main_class_value;
    	let current;
    	header = new Header({ $$inline: true });
    	homescreen = new Home_screen({ $$inline: true });
    	bookscreen = new Book_screen({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(header.$$.fragment);
    			t0 = space();
    			create_component(homescreen.$$.fragment);
    			t1 = space();
    			create_component(bookscreen.$$.fragment);
    			attr_dev(main, "class", main_class_value = "theme--" + /*$theme*/ ctx[0].scheme);
    			add_location(main, file, 9, 0, 246);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(header, main, null);
    			append_dev(main, t0);
    			mount_component(homescreen, main, null);
    			append_dev(main, t1);
    			mount_component(bookscreen, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*$theme*/ 1 && main_class_value !== (main_class_value = "theme--" + /*$theme*/ ctx[0].scheme)) {
    				attr_dev(main, "class", main_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(header.$$.fragment, local);
    			transition_in(homescreen.$$.fragment, local);
    			transition_in(bookscreen.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(header.$$.fragment, local);
    			transition_out(homescreen.$$.fragment, local);
    			transition_out(bookscreen.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(header);
    			destroy_component(homescreen);
    			destroy_component(bookscreen);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let $theme;
    	validate_store(theme, 'theme');
    	component_subscribe($$self, theme, $$value => $$invalidate(0, $theme = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		theme,
    		Header,
    		BookScreen: Book_screen,
    		HomeScreen: Home_screen,
    		$theme
    	});

    	return [$theme];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
