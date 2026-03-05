import type { CollectionConfig } from 'payload';
import { isEditorOrAdmin } from '../access/roles';

export const Products: CollectionConfig = {
	slug: 'products',
	admin: {
		useAsTitle: 'title',
		defaultColumns: ['title', 'slug', 'priceValue', 'stockStatus', 'isFeature']
	},
	access: {
		read: () => true,
		create: isEditorOrAdmin,
		update: isEditorOrAdmin,
		delete: isEditorOrAdmin
	},
	hooks: {
		beforeValidate: [
			({ data }) => {
				if (!data) return data;
				if (typeof data.priceValue === 'number' && Number.isFinite(data.priceValue)) {
					data.price = `$${data.priceValue.toFixed(2)}`;
				}
				return data;
			}
		]
	},
	fields: [
		{
			name: 'title',
			type: 'text',
			required: true
		},
		{
			name: 'slug',
			type: 'text',
			required: true,
			unique: true,
			index: true
		},
		{
			name: 'description',
			type: 'textarea'
		},
		{
			name: 'priceValue',
			type: 'number',
			required: true,
			min: 0
		},
		{
			name: 'price',
			type: 'text',
			admin: {
				readOnly: true
			}
		},
		{
			name: 'image',
			type: 'text',
			required: true
		},
		{
			name: 'images',
			type: 'array',
			fields: [{ name: 'url', type: 'text', required: true }]
		},
		{
			name: 'categories',
			type: 'relationship',
			relationTo: 'categories',
			hasMany: true
		},
		{
			name: 'attributes',
			type: 'json'
		},
		{
			name: 'isFeature',
			type: 'checkbox',
			defaultValue: false
		},
		{
			name: 'hasVariants',
			type: 'checkbox',
			defaultValue: false
		},
		{
			name: 'stockStatus',
			type: 'select',
			defaultValue: 'in_stock',
			options: [
				{ label: 'In Stock', value: 'in_stock' },
				{ label: 'Low Stock', value: 'low_stock' },
				{ label: 'Out of Stock', value: 'out_of_stock' },
				{ label: 'Preorder', value: 'preorder' }
			]
		},
		{
			name: 'gender',
			type: 'select',
			defaultValue: 'unisex',
			options: [
				{ label: 'Unisex', value: 'unisex' },
				{ label: 'Women', value: 'women' },
				{ label: 'Men', value: 'men' },
				{ label: 'Kids', value: 'kids' }
			]
		},
		{
			name: 'stripePriceId',
			type: 'text'
		},
		{
			name: 'tag',
			type: 'text'
		},
		{
			name: 'variants',
			type: 'array',
			fields: [
				{ name: 'color', type: 'text' },
				{ name: 'colorSwatch', type: 'text' },
				{ name: 'size', type: 'text' },
				{ name: 'sku', type: 'text' },
				{
					name: 'stockStatus',
					type: 'select',
					options: [
						{ label: 'In Stock', value: 'in_stock' },
						{ label: 'Low Stock', value: 'low_stock' },
						{ label: 'Out of Stock', value: 'out_of_stock' },
						{ label: 'Preorder', value: 'preorder' }
					]
				},
				{
					name: 'stockQuantity',
					type: 'number',
					min: 0
				},
				{
					name: 'image',
					type: 'text'
				},
				{
					name: 'galleryImages',
					type: 'array',
					fields: [{ name: 'url', type: 'text', required: true }]
				}
			]
		}
	]
};
