<script lang="ts">
	import { page } from '$app/stores';
	import HeroMediaLayer from '$lib/components/ui/HeroMediaLayer.svelte';
	import SectionActionLinks from '$lib/components/ui/SectionActionLinks.svelte';
	import type { UISection } from '$lib/types';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { i18n } from '$lib/stores/i18n.svelte';
	import AnimatedLogo from '$lib/components/ui/AnimatedLogo.svelte';

	interface HeroProps {
		section: UISection;
	}

	let { section }: HeroProps = $props();

	const heroHeadingKey = $derived((section.heading || '').trim().toUpperCase());
	const isLogoHeading = $derived(['PANDASHOP', 'PANDA CREATIVE'].includes(heroHeadingKey));
	const heroLogoContainerStyle = $derived(
		heroHeadingKey === 'PANDA CREATIVE'
			? 'width:min(72vw,1080px);max-width:none;opacity:0.95;margin-bottom:0.5rem;'
			: 'width:min(92vw,1560px);max-width:none;opacity:0.95;margin-bottom:0.5rem;'
	);
	const isShopPage = $derived($page.url.pathname === '/shop');
	const heroHeightClass = $derived(
		isShopPage ? 'h-[50vh] min-h-[420px]' : 'h-screen min-h-[600px]'
	);
	const heroContentOffsetClass = $derived(isShopPage ? 'pt-8 md:pt-10' : '-top-12 md:-top-16');
	const heroActionsClass = $derived(
		isShopPage
			? 'absolute bottom-8 md:bottom-10 z-20 w-full flex flex-col md:flex-row items-center justify-center gap-6 px-6'
			: 'absolute bottom-16 md:bottom-24 z-20 w-full flex flex-col md:flex-row items-center justify-center gap-10 px-6'
	);
	const heroActionsInnerClass = $derived(
		isShopPage
			? 'w-full flex flex-col md:flex-row items-center justify-center gap-6 px-6'
			: 'w-full flex flex-col md:flex-row items-center justify-center gap-10 px-6'
	);

	let translatedHeading = $derived(i18n.tx(section.heading || ''));
	let translatedSubheading = $derived(i18n.tx(section.subheading || ''));

	let slides = $derived.by(() => {
		if (!section) return [];
		const items: { type: 'image' | 'video'; url: string }[] = [];

		const vGallery = section.videoGallery || [];
		if (vGallery.length > 0) {
			vGallery.forEach((v) => v && items.push({ type: 'video', url: v }));
		} else if (section.videoUrl) {
			items.push({ type: 'video', url: section.videoUrl });
		}

		const iGallery = section.imageGallery || [];
		if (iGallery.length > 0) {
			iGallery.forEach((img) => img && items.push({ type: 'image', url: img }));
		} else if (section.imageUrl) {
			items.push({ type: 'image', url: section.imageUrl });
		}

		return items;
	});

	let currentIndex = $state(0);

	onMount(() => {
		if (slides.length <= 1) return;

		const interval = setInterval(() => {
			if (slides.length > 1) {
				currentIndex = (currentIndex + 1) % slides.length;
			}
		}, 5000);

		return () => clearInterval(interval);
	});
</script>

<section
	class={`relative w-full ${heroHeightClass} flex items-center justify-center overflow-hidden bg-black`}
>
	<div class="absolute inset-0 w-full h-full z-0">
		{#if slides.length > 0}
			{#each slides as slide, i (slide.url + i)}
				{#if i === currentIndex}
					<div class="absolute inset-0 w-full h-full" transition:fade={{ duration: 1000 }}>
						<HeroMediaLayer
							mediaType={slide.type}
							src={slide.url}
							alt={translatedHeading}
							priority={i === 0}
						/>
					</div>
				{/if}
			{/each}
		{:else}
			<div class="absolute inset-0 bg-neutral-900 w-full h-full"></div>
		{/if}
	</div>

	<div
		class={`relative z-10 flex flex-col items-center justify-center h-full w-full px-4 text-center ${heroContentOffsetClass}`}
	>
		{#if section.subheading && !isLogoHeading}
			<span
				class="inline-block text-white text-[10px] md:text-[13px] font-sans font-medium tracking-[0.18em] md:tracking-[0.3em] uppercase mb-4 opacity-80 max-w-[80vw] md:max-w-none leading-[1.45] [text-wrap:balance]"
				in:fade={{ delay: 300, duration: 1000 }}
			>
				{translatedSubheading}
			</span>
		{/if}

		{#if section.heading}
			{#if isLogoHeading}
				<div in:fade={{ delay: 500, duration: 1000 }} style={heroLogoContainerStyle}>
					<AnimatedLogo alt={translatedHeading} duration="4s" />
				</div>
			{:else}
				<h1
					class="text-white text-[9.5vw] lg:text-[6.5vw] font-display font-normal tracking-normal mb-2 opacity-95 uppercase whitespace-nowrap leading-tight max-w-full"
					in:fade={{ delay: 500, duration: 1000 }}
				>
					{translatedHeading}
				</h1>
			{/if}
		{/if}

		{#if section.subheading && isLogoHeading}
			<span
				class="inline-block text-white text-[10px] md:text-[13px] font-sans font-medium tracking-[0.18em] md:tracking-[0.3em] uppercase mt-4 opacity-80 max-w-[72vw] md:max-w-none leading-[1.45] [text-wrap:balance]"
				in:fade={{ delay: 300, duration: 1000 }}
			>
				{translatedSubheading}
			</span>
		{/if}
	</div>

	{#if !isShopPage}
		<div class={heroActionsClass}>
			<SectionActionLinks
				actions={section.settings?.actions}
				containerClass={heroActionsInnerClass}
				linkClass="inline-flex items-center justify-center w-full md:w-[320px] px-8 py-4 border border-white text-white text-xs font-sans font-medium tracking-[0.15em] uppercase transition-all duration-300 hover:bg-white hover:text-black"
			/>
		</div>
	{/if}

	{#if slides.length > 1}
		<div class="absolute bottom-8 z-30 flex gap-2">
			{#each slides as _, i (i)}
				<button
					class="w-1.5 h-1.5 rounded-full transition-all duration-500 {i === currentIndex
						? 'bg-white w-4'
						: 'bg-white/30'}"
					onclick={() => (currentIndex = i)}
					aria-label={`Slide ${i + 1}`}
				></button>
			{/each}
		</div>
	{/if}
</section>
