<script lang="ts">
	import type { NavItem } from '$lib/types';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { useCart } from '$lib/stores/cart.svelte';
	import { i18n, type LanguageCode } from '$lib/stores/i18n.svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import { browser } from '$app/environment';

	const cart = useCart();

	interface Props {
		navItems: NavItem[];
		onClose: () => void;
		onSearchClick: () => void;
		onCartClick: () => void;
	}

	let { navItems, onClose, onSearchClick, onCartClick }: Props = $props();

	const EXTERNAL_LINK_RE = /^(https?:\/\/|mailto:|tel:|#)/i;

	async function navigate(url: string) {
		const target = url?.trim();
		if (!target) return;

		onClose();

		if (EXTERNAL_LINK_RE.test(target)) {
			if (browser) {
				window.location.href = target;
			}
			return;
		}

		await goto(target);
	}

	async function selectLanguage(lang: LanguageCode) {
		const previous = i18n.language;
		i18n.setLanguage(lang);
		if (previous !== lang) {
			await invalidateAll();
		}
	}
</script>

<div
	class="fixed inset-x-0 bottom-0 top-[var(--header-height)] bg-background-light dark:bg-background-dark text-primary dark:text-white z-[var(--z-modal)] border-t border-primary/5 dark:border-white/5 overflow-y-auto"
	role="dialog"
	aria-modal="true"
	transition:fly={{ y: -10, duration: 300, easing: cubicOut }}
>
	<nav
		class="flex flex-col p-6 text-[11px] font-sans uppercase tracking-[0.15em] min-h-full bg-background-light dark:bg-background-dark touch-manipulation"
	>
		{#if navItems && navItems.length > 0}
			{#each navItems as link (link.url)}
				<button
					type="button"
					onclick={() => navigate(link.url)}
					class="block py-3 hover:text-primary/70 text-left w-full"
				>
					{i18n.tx(link.label)}
				</button>
			{/each}
		{/if}

		<div class="h-px bg-primary/5 dark:bg-white/5 my-2"></div>

		<button type="button" onclick={() => navigate('/wishlist')} class="block py-3 hover:text-primary/70 text-left w-full">
			{i18n.tx('Wishlist')}
		</button>
		<button type="button" onclick={() => navigate('/account')} class="block py-3 hover:text-primary/70 text-left w-full">
			{i18n.tx('Account')}
		</button>
		<button
			onclick={onSearchClick}
			class="text-left uppercase tracking-[0.15em] cursor-pointer py-3 w-full hover:text-primary/70"
		>
			{i18n.tx('Search')}
		</button>
		<button
			onclick={() => {
				onClose();
				onCartClick();
			}}
			class="text-left uppercase tracking-[0.15em] cursor-pointer py-3 w-full hover:text-primary/70"
		>
			{i18n.tx('Bag')} ({cart.count})
		</button>

		<div class="h-px bg-primary/5 dark:bg-white/5 my-2"></div>

		<div class="flex items-center gap-2 py-2">
			<span class="material-symbols-outlined text-[16px]">language</span>
			{#each i18n.options as option (option.code)}
				<button
					onclick={() => selectLanguage(option.code)}
					class="text-[10px] px-2 py-1 border border-primary/20 dark:border-white/20 {i18n.language ===
					option.code
						? 'bg-primary text-white dark:bg-white dark:text-primary'
						: 'hover:bg-primary/5 dark:hover:bg-white/10'}"
				>
					{option.menuLabel}
				</button>
			{/each}
		</div>
	</nav>
</div>
