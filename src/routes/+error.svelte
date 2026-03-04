<script lang="ts">
	import { page } from '$app/stores';
	import '../app.css';
	import { DEFAULTS } from '$lib/constants';
	import { i18n } from '$lib/stores/i18n.svelte';
	import logo from '$lib/assets/logo.svg';
</script>

<svelte:head>
	<title>
		{$page.status === 503 ? i18n.tx('Maintenance') : i18n.tx('Error')} | {DEFAULTS.siteName}
	</title>
</svelte:head>

<div
	class="min-h-screen w-full bg-[#111] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden"
>
	{#if $page.status === 503}
		<div class="z-10 text-center max-w-lg animate-in fade-in zoom-in duration-700">
			<div class="mb-12">
				<img
					src={logo}
					alt={DEFAULTS.siteName}
					class="mx-auto h-14 md:h-18 w-auto object-contain brightness-0 invert"
					loading="eager"
					decoding="async"
				/>
				<div class="h-[1px] w-24 bg-white/20 mx-auto mt-6"></div>
			</div>

			<div class="space-y-6">
				<h2 class="text-xs md:text-sm font-sans uppercase tracking-[0.3em] text-white/60">
					{i18n.tx('System Status')}
				</h2>
				<p class="text-2xl md:text-3xl font-display uppercase leading-tight tracking-wide">
					{i18n.tx('Currently Under Maintenance')}
				</p>
				<p class="font-sans text-sm text-white/40 leading-relaxed max-w-xs mx-auto">
					{i18n.tx(
						'We are currently updating our experience to serve you better. Please check back shortly.'
					)}
				</p>
			</div>
		</div>

		<div
			class="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"
		></div>
	{:else}
		<div class="z-10 text-center max-w-md">
			<a href="/" class="mb-10 inline-flex justify-center">
				<img
					src={logo}
					alt={DEFAULTS.siteName}
					class="h-10 md:h-12 w-auto object-contain brightness-0 invert"
					loading="eager"
					decoding="async"
				/>
			</a>
			<h1 class="text-[120px] leading-none font-display font-bold text-white/5 mb-[-40px]">
				{$page.status}
			</h1>
			<h2 class="text-xl font-display uppercase tracking-widest mb-6 relative z-10">
				{$page.status === 404 ? i18n.tx('Page Not Found') : i18n.tx('Something Went Wrong')}
			</h2>
			<p class="text-sm text-white/50 mb-12 tracking-wider font-sans">
				{$page.error?.message || i18n.tx('An unexpected error occurred.')}
			</p>
			<a
				href="/"
				class="inline-block border border-white/20 hover:border-white px-8 py-3 text-xs uppercase tracking-[0.2em] transition-all hover:bg-white hover:text-black"
			>
				{i18n.tx('Return Home')}
			</a>
		</div>
	{/if}

	<div class="absolute bottom-8 left-0 w-full text-center">
		<p class="text-[10px] uppercase tracking-widest text-white/20">
			&copy; {new Date().getFullYear()}
			{DEFAULTS.siteName}
		</p>
	</div>
</div>
