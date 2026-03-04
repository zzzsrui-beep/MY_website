<script lang="ts">
	import { page } from '$app/stores';
	import { useCart } from '$lib/stores/cart.svelte';
	import { goto } from '$app/navigation';
	import { DEFAULTS } from '$lib/constants';
	import { isLinkActive } from '$lib/utils/core';
	import { browser } from '$app/environment';
	import { i18n, type LanguageCode } from '$lib/stores/i18n.svelte';
	import HeaderSearch from './header/HeaderSearch.svelte';
	import logo from '$lib/assets/logo.svg';

	const cart = useCart();

	import type { NavItem } from '$lib/types';

	interface HeaderProps {
		variant?: 'transparent' | 'solid';
		navItems?: NavItem[];
		onCartClick?: () => void;
		onMenuClick?: () => void;
		siteName?: string;
		isMenuOpen?: boolean;
	}

	let {
		variant = undefined,
		navItems = [],
		onCartClick,
		onMenuClick,
		siteName = DEFAULTS.siteName,
		isMenuOpen = false
	}: HeaderProps = $props();

	let isSearchOpen = $state(false);
	let isScrolled = $state(false);
	let isVisible = $state(true);
	let lastScrollY = $state(0);
	let searchQuery = $state('');
	let isLanguageMenuOpen = $state(false);
	let languageMenuEl = $state<HTMLDivElement | null>(null);

	function handleSearch(e: Event) {
		e.preventDefault();
		if (searchQuery.trim()) {
			goto(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
			isSearchOpen = false;
		}
	}

	let isWishlistPage = $derived($page.url.pathname === '/wishlist');
	let isAccountPage = $derived($page.url.pathname === '/account');
	let isHomePage = $derived($page.url.pathname === '/');

	let hasHeroAtTop = $derived.by(() => {
		const sections = $page.data.sections || [];
		if (sections.length === 0) return false;

		const firstSection = [...sections]
			.filter((s) => s.isActive !== false)
			.sort((a, b) => a.sortOrder - b.sortOrder)[0];

		return firstSection?.type === 'hero';
	});

	let isDarkHeroPage = $derived(isHomePage || $page.url.pathname === '/collection' || hasHeroAtTop);

	let effectiveVariant = $derived(variant ?? (isAccountPage ? 'solid' : 'transparent'));

	function toggleMenu() {
		onMenuClick?.();
	}

	function toggleSearch() {
		isSearchOpen = !isSearchOpen;
		if (isSearchOpen && isMenuOpen) {
			onMenuClick?.();
		}
	}

	function toggleLanguageMenu() {
		isLanguageMenuOpen = !isLanguageMenuOpen;
	}

	function selectLanguage(lang: LanguageCode) {
		i18n.setLanguage(lang);
		isLanguageMenuOpen = false;
	}

	$effect(() => {
		if (!isLanguageMenuOpen || !browser) return;

		function handleOutsideClick(event: MouseEvent) {
			const target = event.target as Node;
			const clickedLanguage = !!languageMenuEl && languageMenuEl.contains(target);
			if (clickedLanguage) return;
			isLanguageMenuOpen = false;
		}

		function handleEscape(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				isLanguageMenuOpen = false;
			}
		}

		document.addEventListener('click', handleOutsideClick);
		document.addEventListener('keydown', handleEscape);

		return () => {
			document.removeEventListener('click', handleOutsideClick);
			document.removeEventListener('keydown', handleEscape);
		};
	});

	let ticking = false;

	function handleScroll() {
		if (!ticking) {
			window.requestAnimationFrame(() => {
				const currentScrollY = window.scrollY;
				isScrolled = currentScrollY > 20;

				if (currentScrollY > 100) {
					isVisible = currentScrollY < lastScrollY || currentScrollY <= 0;
				} else {
					isVisible = true;
				}

				lastScrollY = currentScrollY;
				ticking = false;
			});
			ticking = true;
		}
	}

	let headerContextClass = $derived.by(() => {
		const commonBorder = 'border-b';
		const transitionClass = 'transition-all duration-500 ease-in-out';

		if (isSearchOpen) {
			return `${commonBorder} ${transitionClass} bg-background-light dark:bg-background-dark text-primary dark:text-white border-transparent h-[140px]`;
		}

		if (effectiveVariant === 'solid' || isScrolled || isMenuOpen) {
			const base = `${commonBorder} ${transitionClass} bg-background-light dark:bg-background-dark text-primary dark:text-white`;
			return isScrolled
				? `${base} border-primary/10 dark:border-white/10`
				: `${base} border-transparent`;
		}

		const textColor = isDarkHeroPage
			? 'text-white'
			: 'text-primary dark:text-white underline-offset-4';
		return `${commonBorder} ${transitionClass} bg-transparent ${textColor} border-transparent`;
	});

	function checkLinkActive(linkHref: string) {
		return isLinkActive(linkHref, $page.url.pathname, $page.url.search);
	}
</script>

<svelte:window onscroll={handleScroll} />

<header
	class="fixed top-0 left-0 w-full z-[var(--z-header)] transition-all duration-500 ease-in-out {headerContextClass} {isVisible
		? 'translate-y-0'
		: '-translate-y-full'}"
>
	{#if isSearchOpen}
		<div
			class="absolute inset-0 top-full h-screen bg-black/20 backdrop-blur-sm transition-all duration-500"
			onclick={toggleSearch}
			onkeydown={(e) => e.key === 'Escape' && toggleSearch()}
			role="button"
			tabindex="-1"
			aria-label="Close search overlay"
		></div>
	{/if}

	<div
		class="max-w-[1600px] mx-auto px-6 md:px-12 h-[var(--header-height)] flex items-center justify-between relative"
	>
		<div
			class="hidden md:flex items-center gap-8 text-[10px] font-sans uppercase tracking-[0.15em]"
		>
			{#each navItems as link (link.url)}
				<a
					href={link.url}
					data-sveltekit-preload-data="hover"
					class="border-b pb-1 {checkLinkActive(link.url)
						? 'border-current'
						: 'border-transparent hover:border-current'}"
				>
					{i18n.tx(link.label)}
				</a>
			{/each}
		</div>

		<button
			onclick={toggleMenu}
			aria-label="Toggle menu"
			class="md:hidden p-2 -ml-2 hover:opacity-70 transition-opacity outline-none focus:outline-none active:outline-none tap-highlight-transparent"
		>
			<span class="material-symbols-outlined text-[24px]">
				{isMenuOpen ? 'close' : 'menu'}
			</span>
		</button>

		<div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
			<a href="/" class="block whitespace-nowrap" aria-label={`${siteName} Home`}>
				<img
					src={logo}
					alt={siteName}
					class="h-8 md:h-10 w-auto max-w-[180px] md:max-w-[240px] object-contain brightness-0 invert"
					loading="eager"
					decoding="async"
				/>
			</a>
		</div>

		<div
			class="hidden md:flex items-center gap-8 text-[10px] font-sans uppercase tracking-[0.15em]"
		>
			<div class="relative" bind:this={languageMenuEl}>
				<button
					onclick={toggleLanguageMenu}
					class="appearance-none bg-transparent border-b border-solid pb-1 cursor-pointer border-transparent hover:border-current inline-flex items-center gap-1"
					aria-label={i18n.tx('Language')}
				>
					<span class="material-symbols-outlined text-[14px] leading-none">language</span>
					<span class="text-[9px] leading-none">{i18n.language === 'zh' ? 'CN' : i18n.language.toUpperCase()}</span>
				</button>

				{#if isLanguageMenuOpen}
					<div
						class="absolute right-0 top-[calc(100%+8px)] min-w-[92px] bg-white dark:bg-black border border-primary/10 dark:border-white/10 py-1"
					>
						{#each i18n.options as option (option.code)}
							<button
								onclick={() => selectLanguage(option.code)}
								class="w-full text-left px-3 py-2 text-[10px] uppercase tracking-[0.15em] hover:bg-primary/5 dark:hover:bg-white/10 {i18n.language ===
								option.code
									? 'text-primary dark:text-white'
									: 'text-primary/60 dark:text-white/60'}"
							>
								{option.menuLabel}
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<a
				href="/wishlist"
				data-sveltekit-preload-data="hover"
				class="border-b pb-1 {isWishlistPage && !isSearchOpen
					? 'border-current'
					: 'border-transparent hover:border-current'}"
			>
				{i18n.tx('Wishlist')}
			</a>
			<button
				onclick={toggleSearch}
				class="appearance-none bg-transparent border-b border-solid pb-1 cursor-pointer {isSearchOpen
					? 'border-current'
					: 'border-transparent hover:border-current'}"
			>
				{i18n.tx('SEARCH')}
			</button>
			<a
				href="/account"
				data-sveltekit-preload-data="hover"
				class="border-b pb-1 {isAccountPage && !isSearchOpen
					? 'border-current'
					: 'border-transparent hover:border-current'}"
			>
				{i18n.tx('Account')}
			</a>
			<button
				onclick={onCartClick}
				class="appearance-none bg-transparent border-b border-solid pb-1 cursor-pointer border-transparent hover:border-current"
			>
				{i18n.tx('BAG')} ({cart.count})
			</button>
		</div>
	</div>

	{#if isSearchOpen}
		<HeaderSearch bind:searchQuery onSubmit={handleSearch} />
	{/if}
</header>
