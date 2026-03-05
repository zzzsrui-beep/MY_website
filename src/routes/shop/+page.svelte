<script lang="ts">
	import ProductListGrid from '$lib/components/shop/ProductListGrid.svelte';
	import ProductGridSkeleton from '$lib/components/ui/ProductGridSkeleton.svelte';
	import Drawer from '$lib/components/ui/Drawer.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { parsePrice } from '$lib/utils/price';
	import SectionRenderer from '$lib/components/SectionRenderer.svelte';
	import { fade } from 'svelte/transition';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { i18n } from '$lib/stores/i18n.svelte';

	let { data } = $props();

	const categories = $derived([
		{ name: i18n.tx('All Products'), slug: 'ALL' },
		...data.categories
			.filter((c) => !data.navCategorySlugs.includes(c.slug))
			.map((c) => ({
				name: i18n.tx(c.name || 'Unknown'),
				slug: c.slug
			}))
	]);

	let activeCategory = $derived($page.url.searchParams.get('category') || 'ALL');
	let activeSearch = $derived($page.url.searchParams.get('search') || '');
	let activeSort = $state('Featured');
	let isFilterOpen = $state(false);

	let isNavLevelCategory = $derived(() => {
		const currentCategory = $page.url.searchParams.get('category');
		return currentCategory && data.navCategorySlugs.includes(currentCategory);
	});

	let showFilterButton = $derived($page.url.searchParams.has('gender') && !isNavLevelCategory());

	function selectCategory(slug: string) {
		const url = new URL($page.url);
		if (slug === 'ALL') {
			url.searchParams.delete('category');
		} else {
			url.searchParams.set('category', slug);
		}
		goto(url.toString(), { replaceState: false, noScroll: true });
	}

	type FilterState = {
		PILLAR: string[];
		'PRODUCT TYPE': string[];
		SIZES: string[];
		COLOR: string[];
		[key: string]: string[];
	};

	let selectedFilters = $state<FilterState>({
		PILLAR: [],
		'PRODUCT TYPE': [],
		SIZES: [],
		COLOR: []
	});

	const filterGroups = {
		PILLAR: ['FEAR OF GOD', 'ESSENTIALS', 'ATHLETICS'],
		'PRODUCT TYPE': [
			'HOODIES',
			'TEES',
			'SWEATPANTS',
			'OUTERWEAR',
			'HATS',
			'CREWNECK',
			'SWEATSHIRTS',
			'PANTS',
			'JACKETS',
			'SHORTS',
			'COATS'
		],
		SIZES: ['XXS', 'S', 'L', 'XXL', 'XXXL', 'XS', 'M', 'XL', 'O/S'],
		COLOR: [
			'BLACK',
			'BLUE',
			'BROWN',
			'CREAM',
			'DARK SAPPHIRE',
			'DK BLUE',
			'GREEN',
			'GREY',
			'MED BLUE',
			'RED',
			'SPORTS',
			'WHITE',
			'YELLOW',
			'YELLOW'
		]
	};

	function toggleFilterOption(group: string, option: string) {
		const current = selectedFilters[group];
		if (current.includes(option)) {
			selectedFilters[group] = current.filter((item) => item !== option);
		} else {
			selectedFilters[group] = [...current, option];
		}
	}

	function clearFilters() {
		selectedFilters = {
			PILLAR: [],
			'PRODUCT TYPE': [],
			SIZES: [],
			COLOR: []
		};
	}

	function getProductSortTimestamp(product: { id: string }) {
		const candidate =
			(product as { createdAt?: unknown; updated?: unknown }).createdAt ??
			(product as { createdAt?: unknown; updated?: unknown }).updated;

		if (typeof candidate !== 'string') return Number.NEGATIVE_INFINITY;
		const parsed = Date.parse(candidate);
		return Number.isFinite(parsed) ? parsed : Number.NEGATIVE_INFINITY;
	}

	let filteredProducts = $derived.by(() => {
		let items = data.products;

		if (activeSearch) {
			const q = activeSearch.toUpperCase();
			items = items.filter((p) => p.title.toUpperCase().includes(q));
		}

		return [...items].sort((a, b) => {
			const priceA = parsePrice(a.price);
			const priceB = parsePrice(b.price);

			switch (activeSort) {
				case 'Price: Low to High':
					return priceA - priceB;
				case 'Price: High to Low':
					return priceB - priceA;
				case 'Newest': {
					const timeDiff = getProductSortTimestamp(b) - getProductSortTimestamp(a);
					if (timeDiff !== 0) return timeDiff;
					return String(b.id).localeCompare(String(a.id), undefined, {
						numeric: true,
						sensitivity: 'base'
					});
				}
				default:
					return 0;
			}
		});
	});

	const unifiedTitle = $derived(
		activeSearch ? i18n.tx('SEARCH RESULTS') : i18n.tx(data.page?.title || 'Collection')
	);

	let visibleCount = $state(6);

	$effect(() => {
		void activeCategory;
		void activeSearch;
		void activeSort;
		visibleCount = 6;
	});

	let displayProducts = $derived(filteredProducts.slice(0, visibleCount));

	function loadMore() {
		visibleCount += 6;
	}
</script>

<svelte:head>
	<title>{i18n.tx(data.page?.title || 'Shop')} | {data.settings.siteName}</title>
	<meta
		name="description"
		content={data.page?.metaDescription ||
			i18n.tx('Explore our curated collection of luxury fashion essentials.')}
	/>
</svelte:head>

{#if data.sections && data.sections.length > 0}
	<div class="w-full">
		{#each data.sections as section (section.id)}
			<SectionRenderer {section} />
		{/each}
	</div>
{/if}

<section class="w-full px-4 md:px-12 py-6 md:py-8">
	<div class="mx-auto w-full max-w-[1440px]" in:fade>
		<div class="flex flex-wrap items-center justify-center gap-3 md:gap-4">
			{#each categories as category (category.slug)}
				<button
					class="inline-flex h-11 min-w-[150px] items-center justify-center border px-4 text-center text-[10px] md:text-[11px] leading-tight tracking-[0.12em] uppercase transition-colors {activeCategory ===
					category.slug
						? 'bg-primary text-white border-primary dark:bg-white dark:text-black dark:border-white'
						: 'text-primary border-primary/70 hover:border-primary hover:bg-primary/5 dark:text-white dark:border-white/70 dark:hover:border-white dark:hover:bg-white/10'}"
					onclick={() => selectCategory(category.slug)}
				>
					{category.name}
				</button>
			{/each}
		</div>
	</div>
</section>

<div
	class="flex flex-col items-center w-full px-4 md:px-12 py-12 {data.sections?.length
		? ''
		: 'pt-32'}"
>
	<div class="w-full max-w-[1440px] flex flex-col gap-16">
		<section class="flex flex-col gap-8 items-center text-center">
			<h2
				class="text-3xl md:text-5xl font-display font-medium tracking-[0.05em] uppercase leading-tight text-primary dark:text-white mb-4"
			>
				{unifiedTitle}
			</h2>

			{#if showFilterButton}
				<div class="relative w-full" in:fade>
					<div class="w-full py-2 flex justify-end px-4 md:px-0">
						<div class="flex items-center text-[10px] tracking-[0.1em] text-primary dark:text-white">
							<button
								class="flex items-baseline gap-2 hover:opacity-60 transition-opacity font-bold"
								onclick={() => (isFilterOpen = true)}
							>
								{i18n.tx('Filter')}
								<span class="text-[16px] font-light leading-none">+</span>
							</button>
						</div>
					</div>
				</div>
			{/if}
		</section>

		<section
			class="grid grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-4 md:gap-x-12 relative min-h-[400px]"
		>
			{#if filteredProducts.length === 0}
				<div
					class="col-span-full flex flex-col items-center justify-center py-32 text-primary/40 dark:text-white/40 gap-6"
					in:fade
				>
					<span class="material-symbols-outlined text-4xl opacity-50">search_off</span>
					<p class="text-sm uppercase tracking-widest">{i18n.tx('No products found in this category')}</p>
				</div>
			{:else if data.products.length === 0}
				<div class="col-span-full">
					<ProductGridSkeleton count={8} columns={4} />
				</div>
			{:else}
				<div class="col-span-full" in:fade={{ duration: 300 }}>
					<ProductListGrid
						products={displayProducts}
						variant="card"
						gridClass="grid grid-cols-2 lg:grid-cols-3 gap-y-16 gap-x-4 md:gap-x-12"
						cardWrapperClass="group flex flex-col gap-4"
					/>
				</div>
			{/if}
		</section>

		{#if filteredProducts.length > visibleCount}
			<div class="flex justify-center py-16" in:fade>
				<button
					onclick={loadMore}
					class="text-[10px] font-sans font-medium tracking-[0.15em] border-b border-primary dark:border-white pb-[3px] uppercase hover:opacity-60 transition-opacity"
				>
					{i18n.tx('View More Products')}
				</button>
			</div>
		{/if}
	</div>
</div>

<Drawer
	isOpen={isFilterOpen}
	onClose={() => (isFilterOpen = false)}
	title={i18n.tx('Filter')}
	width="w-full md:w-[410px]"
>
	<div class="flex flex-col gap-10 pb-12">
		{#each Object.entries(filterGroups) as [groupName, options] (groupName)}
			<div class="space-y-6">
				<h4
					class="text-[10px] font-bold tracking-[0.2em] uppercase text-primary/40 dark:text-white/40"
				>
					{i18n.tx(groupName)}
				</h4>
				<div class="grid grid-cols-2 gap-y-5 gap-x-4">
					{#each options as option (option)}
						<label class="flex items-center gap-3 cursor-pointer group">
							<div class="relative flex items-center">
								<input
									type="checkbox"
									class="peer appearance-none w-3 h-3 border border-primary dark:border-white checked:bg-primary dark:checked:bg-white transition-all rounded-[1px]"
									checked={selectedFilters[groupName].includes(option)}
									onchange={() => toggleFilterOption(groupName, option)}
								/>
							</div>
							<span
								class="text-[10px] font-bold tracking-[0.1em] uppercase transition-colors {selectedFilters[
									groupName
								].includes(option)
									? 'text-primary dark:text-white'
									: 'text-primary/40 dark:text-white/40 group-hover:text-primary dark:group-hover:text-white'}"
							>
								{i18n.tx(option)}
							</span>
						</label>
					{/each}
				</div>
			</div>
		{/each}
	</div>

	{#snippet footer()}
		<div class="grid grid-cols-2 gap-4">
			<Button variant="outline" size="md" fullWidth onclick={clearFilters}>{i18n.tx('Clear')}</Button>
			<Button variant="solid" size="md" fullWidth onclick={() => (isFilterOpen = false)}>
				{i18n.tx('Apply')}
			</Button>
		</div>
	{/snippet}
</Drawer>
