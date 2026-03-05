<script lang="ts">
	import logoIcon from '$lib/assets/logo.svg';
	import '../app.css';
	import Header from '$lib/components/Header.svelte';
	import MobileMenu from '$lib/components/header/MobileMenu.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import CartDrawer from '$lib/components/CartDrawer.svelte';
	import CookieBanner from '$lib/components/CookieBanner.svelte';
	import Toast from '$lib/components/ui/Toast.svelte';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { env } from '$env/dynamic/public';
	import { i18n, initI18n } from '$lib/stores/i18n.svelte';

	import {
		QueryClient,
		QueryClientProvider,
		MutationCache,
		QueryCache
	} from '@tanstack/svelte-query';
	import { browser } from '$app/environment';
	import { toastStore } from '$lib/stores/toast.svelte';
	import Metadata from '$lib/components/seo/Metadata.svelte';

	const COOKIE_CONSENT_KEY = 'cookie_consent';
	const COOKIE_CONSENT_EVENT = 'cookie-consent-change';

	let { children, data } = $props();
	let cookieConsent = $state<string | null>(null);
	const canLoadAnalytics = $derived(
		Boolean(env.PUBLIC_ANALYTICS_CODE) && cookieConsent === 'accepted'
	);

	const queryClient = new QueryClient({
		mutationCache: new MutationCache({
			onError: (error: unknown, _variables, _context, mutation) => {
				if (mutation.meta?.suppressErrorToast) return;

				const message = error instanceof Error ? error.message : String(error);
				toastStore.show(message || 'An error occurred', 'error');
			}
		}),
		queryCache: new QueryCache({
			onError: (error: unknown) => {
				console.error('Global Query Error:', error);
			}
		}),
		defaultOptions: {
			queries: {
				enabled: browser,
				staleTime: 60 * 1000
			}
		}
	});

	let isCartOpen = $state(false);
	let isMenuOpen = $state(false);

	$effect(() => {
		if ($page.url.pathname) {
			isMenuOpen = false;
		}
	});

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	import type { NavItem } from '$lib/types';

	const HIDDEN_HEADER_NAV_LABELS = new Set([
		'plushies',
		'stationery',
		'lifestyle',
		'plush toys',
		'art pieces',
		'apparel accessories',
		'souvenirs',
		'daily products',
		'digital products',
		'promo products'
	]);

	const HEADER_NAV_PRIORITY: Record<string, number> = {
		home: 0,
		collection: 1,
		shop: 2,
		about: 3,
		'about us': 3,
		contact: 4
	};

	const REQUIRED_HEADER_NAV: NavItem[] = [
		{
			id: 'default-home',
			label: 'Home',
			url: '/',
			location: 'header',
			order: 0,
			isVisible: true
		},
		{
			id: 'default-collection',
			label: 'Collection',
			url: '/collection',
			location: 'header',
			order: 1,
			isVisible: true
		},
		{
			id: 'default-shop',
			label: 'Shop',
			url: '/shop',
			location: 'header',
			order: 2,
			isVisible: true
		},
		{
			id: 'default-about',
			label: 'About',
			url: '/about',
			location: 'header',
			order: 3,
			isVisible: true
		},
		{
			id: 'default-contact',
			label: 'Contact',
			url: '/contact',
			location: 'header',
			order: 4,
			isVisible: true
		}
	];

	function filterHeaderNavItems(items: NavItem[]): NavItem[] {
		return items.filter((item) => {
			const label = String(item.label || '').trim().toLowerCase();
			return !HIDDEN_HEADER_NAV_LABELS.has(label);
		});
	}

	function sortHeaderNavItems(items: NavItem[]): NavItem[] {
		return [...items].sort((a, b) => {
			const aLabel = String(a.label || '').trim().toLowerCase();
			const bLabel = String(b.label || '').trim().toLowerCase();
			const aPriority = HEADER_NAV_PRIORITY[aLabel] ?? Number.MAX_SAFE_INTEGER;
			const bPriority = HEADER_NAV_PRIORITY[bLabel] ?? Number.MAX_SAFE_INTEGER;
			if (aPriority !== bPriority) return aPriority - bPriority;
			return (a.order || 0) - (b.order || 0);
		});
	}

	function ensureRequiredHeaderNav(items: NavItem[]): NavItem[] {
		const merged = [...items];
		const existingUrls = new Set(
			merged.map((item) => String(item.url || '').split('?')[0].toLowerCase())
		);
		const existingLabels = new Set(merged.map((item) => String(item.label || '').trim().toLowerCase()));

		for (const required of REQUIRED_HEADER_NAV) {
			const requiredUrl = required.url.toLowerCase();
			const requiredLabel = required.label.toLowerCase();
			if (existingUrls.has(requiredUrl) || existingLabels.has(requiredLabel)) continue;
			merged.push({ ...required });
			existingUrls.add(requiredUrl);
			existingLabels.add(requiredLabel);
		}

		return sortHeaderNavItems(merged);
	}

	let headerNav = $derived.by(() => {
		const incomingHeaderNav = Array.isArray(data.headerNav)
			? filterHeaderNavItems(data.headerNav)
			: [];

		return ensureRequiredHeaderNav(incomingHeaderNav.length ? incomingHeaderNav : REQUIRED_HEADER_NAV);
	});

	function toggleCart() {
		isCartOpen = !isCartOpen;
	}

	onMount(() => {
		initI18n();

		const syncCookieConsent = () => {
			cookieConsent = localStorage.getItem(COOKIE_CONSENT_KEY);
		};

		const handleCookieConsentChange = (event: Event) => {
			const customEvent = event as CustomEvent<{ status?: string }>;
			cookieConsent = customEvent.detail?.status ?? localStorage.getItem(COOKIE_CONSENT_KEY);
		};

		syncCookieConsent();
		window.addEventListener(COOKIE_CONSENT_EVENT, handleCookieConsentChange);

		return () => {
			window.removeEventListener(COOKIE_CONSENT_EVENT, handleCookieConsentChange);
		};
	});
</script>

<Metadata
	title={data.settings.siteName}
	description={`Discover modern luxury essentials at ${data.settings.siteName}. Rooted in independent style and timeless design.`}
	siteName={data.settings.siteName}
/>

<svelte:head>
	<link rel="icon" href={data.settings.icon || logoIcon} />

	{#if canLoadAnalytics}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html env.PUBLIC_ANALYTICS_CODE}
	{/if}
</svelte:head>

<div
	class="flex flex-col min-h-screen bg-background-light dark:bg-background-dark text-text-main dark:text-white transition-colors duration-300"
>
	<a
		href="#main-content"
		class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[200] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:uppercase focus:tracking-widest"
	>
		{i18n.tx('Skip to Content')}
	</a>

	<QueryClientProvider client={queryClient}>
		<Header
			onCartClick={toggleCart}
			onMenuClick={toggleMenu}
			{isMenuOpen}
			navItems={headerNav}
			siteName={data.settings.siteName}
		/>
		<CartDrawer bind:isOpen={isCartOpen} />

		{#if isMenuOpen}
			<MobileMenu
				navItems={headerNav}
				onClose={() => (isMenuOpen = false)}
				onCartClick={toggleCart}
				onSearchClick={() => {
					isMenuOpen = false;
				}}
			/>
		{/if}

		<main id="main-content" class="flex-grow w-full">
			{#key $page.url.pathname}
				<div in:fade={{ duration: 300, delay: 100 }} class="w-full">
					{@render children()}
				</div>
			{/key}
		</main>

		<Footer navItems={data.footerNav} isHome={$page.url.pathname === '/'} />
		<Toast />
		<CookieBanner />
	</QueryClientProvider>
</div>

