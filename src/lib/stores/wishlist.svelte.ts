import { browser } from '$app/environment';
import { STORAGE_KEYS } from '$lib/constants';
import { parsePrice } from '$lib/utils/price';
import type { Product, WishlistItem } from '$lib/types';

function loadWishlist(): WishlistItem[] {
	if (!browser) return [];
	try {
		const stored = localStorage.getItem(STORAGE_KEYS.WISHLIST);
		return stored ? (JSON.parse(stored) as WishlistItem[]) : [];
	} catch {
		return [];
	}
}

function persistWishlist(items: WishlistItem[]) {
	if (!browser) return;
	localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(items));
}

let rawItems = $state<WishlistItem[]>(loadWishlist());
const items = $derived(rawItems);
const count = $derived(items.length);

function updateItems(updater: (current: WishlistItem[]) => WishlistItem[]) {
	rawItems = updater(rawItems);
	persistWishlist(rawItems);
}

export function useWishlist() {
	return {
		get items() {
			return items;
		},
		get count() {
			return count;
		},
		get isLoading() {
			return false;
		},

		toggle(product: Product) {
			const exists = items.some((item) => item.id === product.id);
			if (exists) {
				updateItems((current) => current.filter((item) => item.id !== product.id));
				return;
			}

			const nextItem: WishlistItem = {
				id: product.id,
				title: product.title,
				price: parsePrice(product.price),
				image: product.image,
				slug: product.slug,
				stripePriceId: product.stripePriceId
			};
			updateItems((current) => [...current, nextItem]);
		},

		has(id: string) {
			return items.some((item) => item.id === id);
		},

		remove(id: string) {
			updateItems((current) => current.filter((item) => item.id !== id));
		},

		clearLocal() {
			rawItems = [];
			persistWishlist([]);
		}
	};
}
