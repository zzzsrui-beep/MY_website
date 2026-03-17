<script lang="ts">
	import Skeleton from '$lib/components/ui/Skeleton.svelte';
	import { appendThumbToUrl } from '$lib/utils/image';

	/**
	 * RemoteImage 组件 - 用于远程 URL 图片
	 *
	 * 注意: @sveltejs/enhanced-img 仅适用于本地静态图片（构建时优化）。
	 * 对于来自 R2/CDN 的远程图片，我们使用此组件实现：
	 * - 骨架屏占位
	 * - loading="lazy" / "eager" 优先级控制
	 * - decoding="async"
	 * - fetchpriority 支持
	 *
	 * 如需使用 enhanced-img 处理本地图片，请使用：
	 * import { enhanced } from '@sveltejs/enhanced-img';
	 * <enhanced:img src="$lib/assets/local-image.jpg" alt="..." />
	 */
	interface Props {
		src: string;
		fallbackSrc?: string;
		alt: string;
		className?: string;
		style?: string;
		priority?: boolean; // If true, loading="eager" and fetchpriority="high"
		aspectRatio?: string; // e.g., "3/4" or "16/9" for aspect-ratio CSS
		thumb?: string; // Thumbnail query value, e.g. "100x100"
	}

	let {
		src,
		fallbackSrc = '',
		alt,
		className = '',
		style = '',
		priority = false,
		aspectRatio,
		thumb
	}: Props = $props();

	let loaded = $state(false);
	let error = $state(false);
	let triedFallback = $state(false);
	let currentSrc = $state('');

	function applyThumb(url: string) {
		if (!url) return '';
		return thumb ? appendThumbToUrl(url, thumb) : url;
	}

	let primarySrc = $derived.by(() => {
		if (!src) return '';
		return applyThumb(src);
	});

	let fallbackFinalSrc = $derived.by(() => {
		if (!fallbackSrc) return '';
		return applyThumb(fallbackSrc);
	});

	$effect(() => {
		currentSrc = primarySrc || fallbackFinalSrc || '';
		triedFallback = !primarySrc && Boolean(fallbackFinalSrc);
		loaded = false;
		error = false;
	});

	let avifSrc = $derived.by(() => {
		if (!currentSrc) return '';
		const [rawPath, rawQuery] = currentSrc.split('?');
		if (!rawPath.startsWith('/fallback/') || !/\.webp$/i.test(rawPath)) return '';
		const avifPath = rawPath.replace(/\.webp$/i, '.avif');
		return rawQuery ? `${avifPath}?${rawQuery}` : avifPath;
	});

	let preloadSrc = $derived(avifSrc || primarySrc || currentSrc);

	function handleLoad() {
		loaded = true;
	}

	function handleError() {
		if (!triedFallback && fallbackFinalSrc && currentSrc !== fallbackFinalSrc) {
			triedFallback = true;
			currentSrc = fallbackFinalSrc;
			loaded = false;
			error = false;
			return;
		}
		error = true;
		loaded = true; // Stop showing skeleton
	}

	// 构建 aspect-ratio 样式
	let computedStyle = $derived(aspectRatio ? `aspect-ratio: ${aspectRatio}; ${style}` : style);
</script>

<svelte:head>
	{#if priority && preloadSrc}
		<link rel="preload" as="image" href={preloadSrc} fetchpriority="high" />
	{/if}
</svelte:head>

<div class="relative overflow-hidden {className}" style={computedStyle}>
	<!-- Skeleton / Placeholder -->
	{#if !loaded && !error && currentSrc}
		<div aria-hidden="true" class="absolute inset-0 w-full h-full z-0">
			<Skeleton className="w-full h-full rounded-none" />
		</div>
	{/if}

	<!-- Elegant solid color fallback (All Black) -->
	{#if error || !currentSrc}
		<div aria-hidden="true" class="absolute inset-0 w-full h-full bg-neutral-900 z-0"></div>
	{/if}

	<!-- Image -->
	{#if currentSrc}
		{#if avifSrc}
			<picture class="block w-full h-full z-10">
				<source srcset={avifSrc} type="image/avif" />
				<img
					src={currentSrc}
					{alt}
					class="w-full h-full object-cover transition-opacity duration-700 ease-out {loaded && !error
						? 'opacity-100'
						: 'opacity-0'}"
					loading={priority ? 'eager' : 'lazy'}
					decoding="async"
					fetchpriority={priority ? 'high' : 'auto'}
					onload={handleLoad}
					onerror={handleError}
				/>
			</picture>
		{:else}
			<img
				src={currentSrc}
				{alt}
				class="w-full h-full object-cover transition-opacity duration-700 ease-out z-10 {loaded &&
				!error
					? 'opacity-100'
					: 'opacity-0'}"
				loading={priority ? 'eager' : 'lazy'}
				decoding="async"
				fetchpriority={priority ? 'high' : 'auto'}
				onload={handleLoad}
				onerror={handleError}
			/>
		{/if}
	{/if}
</div>
