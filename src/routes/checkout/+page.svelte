<script lang="ts">
	import { goto } from '$app/navigation';
	import { useCart } from '$lib/stores/cart.svelte';
	import { formatCurrency } from '$lib/utils/price';
	import { i18n } from '$lib/stores/i18n.svelte';

	const cart = useCart();

	function placeDemoOrder() {
		if (cart.items.length === 0) return;
		cart.clear();
		goto('/checkout/success');
	}
</script>

<svelte:head>
	<title>{i18n.tx('Checkout')} | Frontend Mode</title>
</svelte:head>

<div class="min-h-screen pt-32 pb-20 px-6 md:px-12 bg-background-light dark:bg-background-dark">
	<div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-10">
		<section class="border border-primary/10 dark:border-white/10 p-8 md:p-10">
			<h1 class="text-3xl md:text-4xl font-display uppercase tracking-[0.08em] text-primary dark:text-white">
				{i18n.tx('Checkout')}
			</h1>
			<p class="mt-4 text-xs uppercase tracking-[0.16em] text-primary/60 dark:text-white/60">
				Frontend-only checkout shell. Payment, tax, coupon, and inventory APIs are removed.
			</p>

			<div class="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
				<input class="h-12 px-4 border border-primary/20 bg-transparent" placeholder={i18n.tx('Email')} />
				<input class="h-12 px-4 border border-primary/20 bg-transparent" placeholder={i18n.tx('Phone')} />
				<input class="h-12 px-4 border border-primary/20 bg-transparent" placeholder={i18n.tx('First Name')} />
				<input class="h-12 px-4 border border-primary/20 bg-transparent" placeholder={i18n.tx('Last Name')} />
				<input class="h-12 px-4 border border-primary/20 bg-transparent md:col-span-2" placeholder={i18n.tx('Address')} />
				<input class="h-12 px-4 border border-primary/20 bg-transparent" placeholder={i18n.tx('City')} />
				<input class="h-12 px-4 border border-primary/20 bg-transparent" placeholder={i18n.tx('Postal Code')} />
			</div>
		</section>

		<aside class="border border-primary/10 dark:border-white/10 p-8 md:p-10 h-fit">
			<h2 class="text-xl uppercase tracking-widest font-display text-primary dark:text-white mb-6">
				{i18n.tx('Order Summary')}
			</h2>
			{#if cart.items.length === 0}
				<p class="text-xs uppercase tracking-[0.16em] text-primary/50 dark:text-white/50">
					{i18n.tx('Your cart is empty.')}
				</p>
			{:else}
				<div class="space-y-4">
					{#each cart.items as item (item.cartItemId)}
						<div class="flex items-center justify-between gap-4 text-sm">
							<div>
								<p class="uppercase tracking-wide">{item.title}</p>
								<p class="text-xs text-primary/60 dark:text-white/60">Qty {item.quantity}</p>
							</div>
							<p>{formatCurrency((item.price ?? 0) * item.quantity, { currency: cart.currencyCode })}</p>
						</div>
					{/each}
				</div>
				<div class="mt-6 pt-6 border-t border-primary/10 dark:border-white/10 flex items-center justify-between">
					<span class="uppercase tracking-widest text-xs">{i18n.tx('Total')}</span>
					<span class="text-lg font-display">{cart.totalFormatted}</span>
				</div>
			{/if}

			<button
				type="button"
				onclick={placeDemoOrder}
				disabled={cart.items.length === 0}
				class="mt-8 w-full h-12 border border-primary dark:border-white text-xs font-bold uppercase tracking-widest enabled:hover:bg-primary enabled:hover:text-white dark:enabled:hover:bg-white dark:enabled:hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
			>
				{i18n.tx('Place Demo Order')}
			</button>
		</aside>
	</div>
</div>
