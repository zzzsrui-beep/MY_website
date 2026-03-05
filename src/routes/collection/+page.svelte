<script lang="ts">
	import ProductListGrid from '$lib/components/shop/ProductListGrid.svelte';
	import RemoteImage from '$lib/components/ui/RemoteImage.svelte';
	import { resolveAssetUrl } from '$lib/utils/image';
	import { i18n } from '$lib/stores/i18n.svelte';
	import logo from '$lib/assets/logo.svg';

	let { data } = $props();

	type CollectionImageRecord = {
		position: string;
		image: string;
		id: string;
		link?: string;
		title?: string;
	};

	let leftRecord = $derived(
		data.collectionImages?.find((img: CollectionImageRecord) => img.position === 'left')
	);
	let rightRecord = $derived(
		data.collectionImages?.find((img: CollectionImageRecord) => img.position === 'right')
	);

	const getImageUrl = (record: CollectionImageRecord | undefined) => {
		if (!record || !record.image) return '';
		return resolveAssetUrl(record.image);
	};

	let heroImageLeft = $derived(getImageUrl(leftRecord));
	let heroImageRight = $derived(getImageUrl(rightRecord));

	let leftLink = $derived(leftRecord?.link || '/shop?category=plush-toys');
	let rightLink = $derived(rightRecord?.link || '/shop?category=art-pieces');
	let leftTitle = $derived(i18n.tx(leftRecord?.title || 'Plush Toys > New Arrivals'));
	let rightTitle = $derived(i18n.tx(rightRecord?.title || 'Art Pieces'));
	let heroPanels = $derived([
		{
			id: 'left',
			link: leftLink,
			title: leftTitle,
			image: heroImageLeft
		},
		{
			id: 'right',
			link: rightLink,
			title: rightTitle,
			image: heroImageRight
		}
	]);

	let scrollY = $state(0);
	let innerHeight = $state(0);

	let isLanded = $derived(scrollY >= innerHeight * 0.6375);
</script>

<svelte:window bind:scrollY bind:innerHeight />

<svelte:head>
	<title>{i18n.tx('Collection')} | {data.settings.siteName}</title>
</svelte:head>

<div class="relative w-full min-h-screen bg-black">
	<div
		class="left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-30 text-center will-change-transform backface-hidden {isLanded
			? 'absolute top-[calc(100vh+13.75vh)]'
			: 'fixed top-1/2'}"
	>
		<img
			src={logo}
			alt={data.settings.siteName}
			class="w-[calc(100vw-3rem)] md:w-[calc(100vw-6rem)] max-w-none h-auto object-contain select-none brightness-0 invert"
			loading="eager"
			decoding="async"
		/>
	</div>

	<div class="relative w-full h-screen flex flex-col md:flex-row z-0">
		{#each heroPanels as panel (panel.id)}
			<a href={panel.link} class="flex-1 block bg-black overflow-hidden">
				{#if panel.image}
					<RemoteImage
						src={panel.image}
						alt={panel.title}
						className="w-full h-full"
						priority={true}
						thumb="2000x0"
					/>
				{/if}
			</a>
		{/each}
	</div>

	<div class="relative z-20 pt-[27.5vh] pb-12 px-4 md:px-6 bg-black">
		<div class="mb-[calc(3rem+2.5vh)] text-center">
			<span class="text-[20px] font-medium tracking-[0.1em] uppercase text-white"
				>{i18n.tx('Shop Now')}</span
			>
		</div>

		<ProductListGrid
			products={data.products}
			variant="image"
			gridClass="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-x-8 md:gap-y-12"
		/>
	</div>
</div>

