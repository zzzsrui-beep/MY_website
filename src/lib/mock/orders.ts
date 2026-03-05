import { error } from '@sveltejs/kit';
import type { OrderDetail, OrderSummary } from '$lib/types';

const frontendOrderDetails: OrderDetail[] = [
	{
		id: 'ord-1001',
		date: '2026-02-20T10:00:00.000Z',
		status: 'delivered',
		total: 42000,
		currency: 'USD',
		itemCount: 2,
		firstItemTitle: 'Obsidian Trench',
		items: [
			{
				id: 'line-1',
				title: 'Obsidian Trench',
				price: 21000,
				quantity: 2,
				image:
					'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop',
				variant: 'Black / M'
			}
		],
		shippingAddress: {
			name: 'Demo User',
			line1: '200 Market St',
			city: 'San Francisco',
			state: 'CA',
			postalCode: '94105',
			country: 'US'
		},
		tracking: {
			number: 'TRK123456789',
			carrier: 'UPS'
		}
	},
	{
		id: 'ord-1002',
		date: '2026-02-10T09:30:00.000Z',
		status: 'processing',
		total: 23000,
		currency: 'USD',
		itemCount: 1,
		firstItemTitle: 'Leather Tote',
		items: [
			{
				id: 'line-2',
				title: 'Leather Tote',
				price: 23000,
				quantity: 1,
				image:
					'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop',
				variant: 'Brown / O/S'
			}
		],
		shippingAddress: {
			name: 'Demo User',
			line1: '200 Market St',
			city: 'San Francisco',
			state: 'CA',
			postalCode: '94105',
			country: 'US'
		}
	}
];

export function getOrderSummaries(): OrderSummary[] {
	return frontendOrderDetails.map(
		({ items: _items, shippingAddress: _shippingAddress, tracking: _tracking, ...summary }) =>
			summary
	);
}

export function getOrderDetail(id: string): OrderDetail | null {
	return frontendOrderDetails.find((order) => order.id === id) ?? null;
}

export function getOrderDetailOr404(id: string) {
	const order = getOrderDetail(id);
	if (!order) {
		throw error(404, 'Order not found');
	}
	return order;
}
