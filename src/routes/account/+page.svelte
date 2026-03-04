<script lang="ts">
	import { auth } from '$lib/stores/auth.svelte';
	import { i18n } from '$lib/stores/i18n.svelte';
</script>

<svelte:head>
	<title>{i18n.tx('Account')} | Frontend Mode</title>
</svelte:head>

<div class="min-h-screen pt-32 pb-20 px-6 md:px-12 bg-background-light dark:bg-background-dark">
	<div class="max-w-5xl mx-auto">
		<div class="mb-12 text-center md:text-left">
			<h1 class="text-4xl md:text-6xl font-display uppercase tracking-[0.08em] text-primary dark:text-white">
				{i18n.tx('Account')}
			</h1>
			<p class="mt-4 text-xs uppercase tracking-[0.18em] text-primary/60 dark:text-white/60">
				{i18n.tx(
					'Frontend-only mode. Authentication and profile APIs are intentionally disabled.'
				)}
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			<a
				href="/account/orders"
				class="border border-primary/15 dark:border-white/15 p-8 hover:border-primary dark:hover:border-white transition-colors"
			>
				<h2 class="text-xl uppercase tracking-widest font-display text-primary dark:text-white mb-3">
					{i18n.tx('Orders')}
				</h2>
				<p class="text-xs tracking-[0.14em] uppercase text-primary/60 dark:text-white/60">
					{i18n.tx('View mock order history layout.')}
				</p>
			</a>

			<a
				href="/account/addresses"
				class="border border-primary/15 dark:border-white/15 p-8 hover:border-primary dark:hover:border-white transition-colors"
			>
				<h2 class="text-xl uppercase tracking-widest font-display text-primary dark:text-white mb-3">
					{i18n.tx('Addresses')}
				</h2>
				<p class="text-xs tracking-[0.14em] uppercase text-primary/60 dark:text-white/60">
					{i18n.tx('Address book UI preserved, backend removed.')}
				</p>
			</a>

			<a
				href="/wishlist"
				class="border border-primary/15 dark:border-white/15 p-8 hover:border-primary dark:hover:border-white transition-colors"
			>
				<h2 class="text-xl uppercase tracking-widest font-display text-primary dark:text-white mb-3">
					{i18n.tx('Wishlist')}
				</h2>
				<p class="text-xs tracking-[0.14em] uppercase text-primary/60 dark:text-white/60">
					{i18n.tx('Stored in browser localStorage.')}
				</p>
			</a>
		</div>

		<div class="mt-12 border border-dashed border-primary/20 dark:border-white/20 p-8 text-center">
			<p class="text-xs uppercase tracking-[0.16em] text-primary/60 dark:text-white/60">
				{i18n.tx('Status')}: {auth.isAuthenticated ? i18n.tx('Demo Signed In') : i18n.tx('Guest Session')}
			</p>
		</div>
	</div>
</div>
