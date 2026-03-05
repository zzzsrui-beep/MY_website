<script lang="ts">
	import { DEFAULTS, TRANSITIONS } from '$lib/constants';
	import { i18n } from '$lib/stores/i18n.svelte';

	let { total } = $props<{ total: number }>();

	const threshold = DEFAULTS.freeShippingThreshold;
	let progress = $derived(Math.min(100, (total / threshold) * 100));
	let remaining = $derived(Math.max(0, threshold - total));
	let qualified = $derived(total >= threshold);
</script>

<div class="px-6 pb-6">
	{#if qualified}
		<p class="text-[10px] font-sans text-black mb-2 text-center uppercase tracking-[0.15em]">
			{i18n.tx('You have Free Shipping')}
		</p>
		<div class="h-1 w-full bg-primary/5 dark:bg-white/5 rounded-full overflow-hidden">
			<div class="h-full bg-primary dark:bg-white w-full {TRANSITIONS.transform}"></div>
		</div>
	{:else}
		<p
			class="text-[10px] font-sans text-primary/60 dark:text-white/60 mb-2 text-center uppercase tracking-[0.15em]"
		>
			{i18n.tx('Spend')} <span class="text-primary dark:text-white font-medium">${remaining.toFixed(2)}</span>
			{i18n.tx('more for Free Shipping')}
		</p>
		<div class="h-1 w-full bg-primary/5 dark:bg-white/5 rounded-full overflow-hidden">
			<div
				class="h-full bg-primary dark:bg-white transition-[width] duration-500"
				style="width: {progress}%"
			></div>
		</div>
	{/if}
</div>
