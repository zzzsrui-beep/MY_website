<script lang="ts">
	import type { NavItem } from '$lib/types';
	import { fly, slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { useCart } from '$lib/stores/cart.svelte';
	import { frontendCategories, frontendProducts } from '$lib/mock';

	const cart = useCart();

	interface Props {
		navItems: NavItem[];
		onClose: () => void;
		onSearchClick: () => void;
		onCartClick: () => void;
	}

	let { navItems, onClose, onSearchClick, onCartClick }: Props = $props();

	let expandedMenus = $state<Record<string, boolean>>({});

	function toggleSubmenu(label: string, e?: Event) {
		if (e) e.preventDefault();
		expandedMenus[label] = !expandedMenus[label];
	}

	const categoryIdToSlug = new Map(
		frontendCategories.map((category) => [category.id, category.slug])
	);

	function getSubmenuOptions(parentLabel: string) {
		const parent = parentLabel.toLowerCase();
		if (parent === 'shop') {
			return frontendCategories.map((category) => ({
				label: (category.name || category.slug).toUpperCase(),
				slug: category.slug
			}));
		}

		if (parent === 'plushies' || parent === 'stationery') {
			const slugs = [
				...new Set(
					frontendProducts
						.filter((product) => product.gender === parent)
						.flatMap((product) => product.categoryIds ?? [])
						.map((categoryId) => categoryIdToSlug.get(categoryId))
						.filter((slug): slug is string => Boolean(slug))
				)
			];

			return slugs.map((slug) => {
				const matched = frontendCategories.find((category) => category.slug === slug);
				return {
					label: (matched?.name || slug).toUpperCase(),
					slug
				};
			});
		}

		return [];
	}

	function getSubmenuUrl(parentLabel: string, categorySlug: string) {
		const parent = parentLabel.toLowerCase();

		if (parent === 'plushies' || parent === 'stationery') {
			return `/shop?gender=${parent}&category=${encodeURIComponent(categorySlug)}`;
		}

		return `/shop?category=${encodeURIComponent(categorySlug)}`;
	}
</script>

<div
	class="fixed inset-x-0 bottom-0 top-[var(--header-height)] bg-background-light dark:bg-background-dark text-primary dark:text-white z-40 border-t border-primary/5 dark:border-white/5 overflow-y-auto"
	role="dialog"
	aria-modal="true"
	transition:fly={{ y: -10, duration: 300, easing: cubicOut }}
>
	<nav
		class="flex flex-col p-6 text-[11px] font-sans uppercase tracking-[0.15em] min-h-full bg-background-light dark:bg-background-dark"
	>
		{#if navItems && navItems.length > 0}
			{#each navItems as link (link.url)}
				{@const submenuOptions = getSubmenuOptions(link.label)}
				{@const hasSub = submenuOptions.length > 0}
				{@const isExpanded = expandedMenus[link.label]}

				<div class="border-none">
					<div class="flex items-center justify-between min-h-[40px]">
						<a
							href={link.url}
							onclick={onClose}
							class="flex-1 py-3 transition-colors active:text-primary/60 dark:active:text-white/60"
						>
							{link.label}
						</a>
						{#if hasSub}
							<button
								onclick={(e) => toggleSubmenu(link.label, e)}
								class="h-10 w-10 flex items-center justify-center -mr-2 outline-none tap-highlight-transparent"
								aria-label="Toggle submenu"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="16"
									height="16"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="1"
									class="transition-transform duration-300 {isExpanded ? 'rotate-45' : ''}"
								>
									<path d="M12 4V20M4 12H20" stroke-linecap="square" />
								</svg>
							</button>
						{/if}
					</div>

					{#if hasSub && isExpanded}
						<div class="flex flex-col gap-3 pt-2 pb-4" transition:slide={{ duration: 200 }}>
							<!-- ALL option -->
							<a
								href={link.url}
								onclick={onClose}
								class="text-primary dark:text-white hover:opacity-70 transition-opacity text-[10px]"
							>
								ALL
							</a>

							<!-- Sub categories -->
							{#each submenuOptions as option (option.slug)}
								<a
									href={getSubmenuUrl(link.label, option.slug)}
									onclick={onClose}
									class="text-primary dark:text-white hover:opacity-70 transition-opacity text-[10px]"
								>
									{option.label}
								</a>
							{/each}
						</div>
					{/if}
				</div>
			{/each}
		{/if}

		<div class="h-px bg-primary/5 dark:bg-white/5 my-2"></div>

		<a href="/wishlist" onclick={onClose} class="block py-3 hover:text-primary/70">Wishlist</a>
		<a href="/account" onclick={onClose} class="block py-3 hover:text-primary/70">Account</a>
		<button
			onclick={onSearchClick}
			class="text-left uppercase tracking-[0.15em] cursor-pointer py-3 w-full hover:text-primary/70"
		>
			Search
		</button>
		<button
			onclick={() => {
				onClose();
				onCartClick();
			}}
			class="text-left uppercase tracking-[0.15em] cursor-pointer py-3 w-full hover:text-primary/70"
		>
			Bag ({cart.count})
		</button>
	</nav>
</div>
