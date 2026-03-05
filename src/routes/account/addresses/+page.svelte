<script lang="ts">
	import { i18n } from '$lib/stores/i18n.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>{i18n.tx('Address Book')} | {data.settings.siteName}</title>
</svelte:head>

<div class="min-h-screen pt-32 pb-20 px-6 md:px-12 bg-background-light dark:bg-background-dark">
	<div class="max-w-4xl mx-auto">
		<div class="flex items-end justify-between gap-4 mb-10">
			<div>
				<h1 class="text-4xl md:text-5xl font-display uppercase tracking-widest text-primary dark:text-white">
					{i18n.tx('Address Book')}
				</h1>
				<p class="mt-3 text-xs uppercase tracking-[0.16em] text-primary/60 dark:text-white/60">
					{i18n.tx('Frontend-only placeholder. Connect your future backend for CRUD operations.')}
				</p>
			</div>
			<a href="/account" class="text-xs uppercase tracking-widest hover:underline">{i18n.tx('Back')}</a>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<div class="border border-primary/15 dark:border-white/15 p-6">
				<p class="text-[10px] uppercase tracking-[0.2em] text-primary/50 dark:text-white/50 mb-3">
					{i18n.tx('Home')}
				</p>
				<p class="text-sm text-primary dark:text-white">Demo User</p>
				<p class="text-sm text-primary/70 dark:text-white/70 mt-2">200 Market St</p>
				<p class="text-sm text-primary/70 dark:text-white/70">San Francisco, CA 94105</p>
				<p class="text-sm text-primary/70 dark:text-white/70">United States</p>
			</div>
			<div class="border border-dashed border-primary/20 dark:border-white/20 p-6 flex items-center justify-center">
				<p class="text-xs uppercase tracking-[0.16em] text-primary/50 dark:text-white/50 text-center">
					{i18n.tx('Add / Edit / Delete actions are disabled in frontend mode.')}
				</p>
			</div>
		</div>
	</div>
</div>
