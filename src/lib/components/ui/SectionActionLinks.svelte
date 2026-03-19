<script lang="ts">
	import { browser } from '$app/environment';
	import type { UISectionAction } from '$lib/types';
	import { i18n } from '$lib/stores/i18n.svelte';

	interface Props {
		actions?: UISectionAction[];
		containerClass?: string;
		linkClass?: string;
		preloadData?: 'hover' | 'tap';
		navigationMode?: 'spa' | 'auto' | 'hard';
	}

	let {
		actions = [],
		containerClass = 'flex flex-wrap items-center justify-center gap-4',
		linkClass = 'inline-flex items-center justify-center px-10 py-4 border text-xs font-sans font-medium tracking-[0.15em] uppercase transition-all cursor-pointer',
		preloadData = 'hover',
		navigationMode = 'spa'
	}: Props = $props();

	let visibleActions = $derived(actions.filter((action) => !!action?.text));
	let isNavigating = $state(false);

	function normalizeActionLink(link?: string) {
		const raw = String(link || '').trim();
		if (!raw || raw === '#') return '';
		if (/^(https?:\/\/|mailto:|tel:|#)/i.test(raw)) return raw;
		return raw.startsWith('/') ? raw : `/${raw}`;
	}

	function shouldUseHardNavigation() {
		if (navigationMode === 'hard') return true;
		if (navigationMode !== 'auto' || !browser) return false;
		return window.matchMedia('(max-width: 767px)').matches;
	}

	function handleActionActivate(event: Event, link?: string) {
		if (!shouldUseHardNavigation() || isNavigating || !browser) return;
		const target = normalizeActionLink(link);
		if (!target) return;
		event.preventDefault();
		event.stopPropagation();
		isNavigating = true;
		window.location.assign(target);
	}
</script>

{#if visibleActions.length > 0}
	<div class={containerClass}>
		{#each visibleActions as action, i (action.link || i)}
			<a
				href={action.link || '#'}
				data-sveltekit-preload-data={preloadData}
				onpointerup={(event) => handleActionActivate(event, action.link)}
				onclick={(event) => handleActionActivate(event, action.link)}
				class={`${linkClass} touch-manipulation`}
			>
				{i18n.tx(action.text)}
			</a>
		{/each}
	</div>
{/if}
