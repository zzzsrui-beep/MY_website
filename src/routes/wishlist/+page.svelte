<script lang="ts">
	import { useWishlist } from '$lib/stores/wishlist.svelte';
	import { useCart } from '$lib/stores/cart.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import RemoteImage from '$lib/components/ui/RemoteImage.svelte';
	import WishlistItemCard from '$lib/components/wishlist/WishlistItemCard.svelte';
	import { fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { COLORS, CONTENT_IMAGES, IMAGE_THUMBS } from '$lib/constants';
	import { i18n } from '$lib/stores/i18n.svelte';

	const wishlist = useWishlist();
	const cart = useCart();

	import type { CartItem, WishlistItem } from '$lib/types';

	let { data } = $props();

	let emptyWishlistImage = $derived.by(() => {
		const image = data?.settings?.emptyWishlistImage;
		if (typeof image === 'string' && image.trim().length > 0) return image;
		return CONTENT_IMAGES.WISHLIST_EMPTY;
	});

	function moveToBag(item: WishlistItem) {
		const cartItem: CartItem = {
			id: item.id,
			variantId: item.variantId,
			quantity: 1,
			title: item.title,
			price: item.price,
			image: item.image,
			slug: item.slug,
			stripePriceId: item.stripePriceId
		};
		cart.addRawItem(cartItem);
		wishlist.remove(item.id);
	}
</script>

<svelte:head>
	<title>{i18n.tx('Wishlist')} | {data.settings.siteName}</title>
	<meta name="description" content="Your curated collection of saved items." />
</svelte:head>

<div class="min-h-screen pt-32 pb-20 px-6 md:px-12 {COLORS.bg} overflow-hidden">
	<div
		class="max-w-[1600px] mx-auto mb-16 md:mb-24 flex flex-col md:flex-row justify-between items-end gap-6"
	>
		<div>
			<h1
				class="text-4xl md:text-7xl font-display font-medium uppercase tracking-[0.05em] mb-2 {COLORS.text}"
			>
				{i18n.tx('My Collection')}
			</h1>
		</div>
	</div>

	<div class="max-w-[1600px] mx-auto">
		{#if wishlist.items.length === 0}
			<div
				class="relative w-full h-[50vh] flex flex-col items-center justify-center overflow-hidden group"
				in:fade
			>
				<RemoteImage
					src={emptyWishlistImage}
					alt={i18n.tx('The canvas is empty')}
					className="absolute inset-0 w-full h-full"
					thumb={IMAGE_THUMBS.SECTION_BG}
				/>
				<div class="absolute inset-0 bg-black/35 z-10"></div>
				<div class="relative z-10 text-center space-y-8">
					<p class="text-sm md:text-lg font-display uppercase tracking-[0.3em] text-white">
						{i18n.tx('The canvas is empty')}
					</p>
					<Button href="/shop" size="lg">{i18n.tx('Start Curating')}</Button>
				</div>
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-16">
				{#each wishlist.items as product (product.id)}
					<div in:fade={{ duration: 400 }} animate:flip={{ duration: 400 }}>
						<WishlistItemCard item={product} onRemove={wishlist.remove} onMoveToBag={moveToBag} />
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>
