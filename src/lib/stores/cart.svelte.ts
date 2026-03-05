import { browser } from '$app/environment';
import type { Product, CartItem } from '$lib/types';
import { DEFAULTS, STORAGE_KEYS } from '$lib/constants';
import { formatCurrency as formatCurrencyUtil, parsePrice } from '$lib/utils/price';

let currencyConfig = $state({ code: DEFAULTS.currencyCode as string, locale: 'en-US' });

export function setCurrencyConfig(code: string, locale: string = 'en-US') {
	currencyConfig = { code, locale };
}

function formatCurrency(amount: number): string {
	return formatCurrencyUtil(amount, {
		currency: currencyConfig.code,
		locale: currencyConfig.locale
	});
}

function loadCart(): CartItem[] {
	if (!browser) return [];
	try {
		const stored = localStorage.getItem(STORAGE_KEYS.CART);
		return stored ? (JSON.parse(stored) as CartItem[]) : [];
	} catch {
		return [];
	}
}

function persistCart(items: CartItem[]) {
	if (!browser) return;
	localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
}

let rawItems = $state<CartItem[]>(loadCart());

function normalizeItems(items: CartItem[]): CartItem[] {
	return items.map((item) => ({
		...item,
		price: parsePrice(item.price),
		cartItemId: `${item.id}-${item.variantId || 'base'}`
	}));
}

const items = $derived(normalizeItems(rawItems));
const count = $derived(items.reduce((acc, item) => acc + item.quantity, 0));
const subtotal = $derived(items.reduce((acc, item) => acc + (item.price ?? 0) * item.quantity, 0));

function updateRawItems(updater: (current: CartItem[]) => CartItem[]) {
	rawItems = updater(rawItems);
	persistCart(rawItems);
}

export function useCart() {
	return {
		get items() {
			return items;
		},
		get count() {
			return count;
		},
		get subtotal() {
			return subtotal;
		},
		get total() {
			return subtotal;
		},
		get subtotalFormatted() {
			return formatCurrency(subtotal);
		},
		get totalFormatted() {
			return formatCurrency(subtotal);
		},
		get currencyCode() {
			return currencyConfig.code;
		},
		get isLoading() {
			return false;
		},

		addItem(product: Product, color: string, size: string) {
			const variant = product.variants?.find((v) => v.color === color && v.size === size);
			const nextItem: CartItem = {
				id: product.id,
				variantId: variant?.id,
				quantity: 1,
				title: product.title,
				price: parsePrice(product.price) || parsePrice(product.priceValue),
				image: variant?.image ?? product.image,
				slug: product.slug,
				color,
				size,
				stripePriceId: product.stripePriceId
			};

			updateRawItems((current) => {
				const index = current.findIndex(
					(item) => item.id === nextItem.id && item.variantId === nextItem.variantId
				);
				if (index === -1) {
					return [...current, nextItem];
				}
				const merged = [...current];
				merged[index] = {
					...merged[index],
					quantity: merged[index].quantity + 1
				};
				return merged;
			});
		},

		addRawItem(item: CartItem) {
			const safeItem: CartItem = {
				...item,
				quantity: Math.max(1, Number(item.quantity || 1)),
				price: parsePrice(item.price)
			};
			updateRawItems((current) => {
				const index = current.findIndex(
					(existing) => existing.id === safeItem.id && existing.variantId === safeItem.variantId
				);
				if (index === -1) return [...current, safeItem];
				const merged = [...current];
				merged[index] = {
					...merged[index],
					quantity: merged[index].quantity + safeItem.quantity
				};
				return merged;
			});
		},

		removeItem(cartItemId: string) {
			updateRawItems((current) =>
				normalizeItems(current).filter((item) => item.cartItemId !== cartItemId)
			);
		},

		updateQuantity(cartItemId: string, delta: number) {
			updateRawItems((current) => {
				const normalized = normalizeItems(current);
				const target = normalized.find((item) => item.cartItemId === cartItemId);
				if (!target) return current;
				const nextQty = target.quantity + delta;
				if (nextQty <= 0) {
					return normalized
						.filter((item) => item.cartItemId !== cartItemId)
						.map(({ cartItemId: _cartItemId, ...rest }) => rest);
				}
				return normalized.map(({ cartItemId: _cartItemId, ...rest }) =>
					rest.id === target.id && rest.variantId === target.variantId
						? { ...rest, quantity: nextQty }
						: rest
				);
			});
		},

		clear() {
			rawItems = [];
			persistCart([]);
		}
	};
}
