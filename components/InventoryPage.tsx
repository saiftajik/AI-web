
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAppContext } from '../context/AppContext';
import { Button, Card, Input, Modal, Textarea } from './common/ui';
import { ICONS } from '../constants';
import type { Product } from '../types';

type ProductFormData = Omit<Product, 'id' | 'imageUrls'> & { imageUrls: string };

const ProductForm: React.FC<{ product?: Product; onFormSubmit: (data: Omit<Product, 'id'> | Product) => void; onCancel: () => void }> = ({ product, onFormSubmit, onCancel }) => {
    const { register, handleSubmit, formState: { errors } } = useForm<ProductFormData>({
        defaultValues: product 
            ? { ...product, imageUrls: product.imageUrls.join('\n') } 
            : { name: '', category: '', price: 0, stock: 0, lowStockThreshold: 5, imageUrls: 'https://picsum.photos/400' }
    });
    
    const onSubmit: SubmitHandler<ProductFormData> = data => {
      const transformedData = {
            ...data,
            price: Number(data.price),
            stock: Number(data.stock),
            lowStockThreshold: Number(data.lowStockThreshold),
            imageUrls: data.imageUrls.split('\n').map(url => url.trim()).filter(Boolean)
        };

        if (product) {
            onFormSubmit({ ...transformedData, id: product.id });
        } else {
            onFormSubmit(transformedData);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Product Name" {...register('name', { required: 'Name is required' })} />
            {errors.name && <p className="text-red-400 text-sm">{errors.name.message}</p>}

            <Input label="Category" {...register('category', { required: 'Category is required' })} />
            {errors.category && <p className="text-red-400 text-sm">{errors.category.message}</p>}

            <Input label="Price" type="number" step="0.01" {...register('price', { required: 'Price is required', min: 0 })} />
            {errors.price && <p className="text-red-400 text-sm">{errors.price.message}</p>}
            
            <Input label="Stock" type="number" {...register('stock', { required: 'Stock is required', min: 0 })} />
            {errors.stock && <p className="text-red-400 text-sm">{errors.stock.message}</p>}
            
            <Input label="Low Stock Threshold" type="number" {...register('lowStockThreshold', { required: 'Threshold is required', min: 0 })} />
            {errors.lowStockThreshold && <p className="text-red-400 text-sm">{errors.lowStockThreshold.message}</p>}

            <Textarea 
                label="Image URLs (one per line)" 
                rows={4}
                {...register('imageUrls')} 
                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
            />

            <div className="flex justify-end gap-4 pt-4">
                <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                <Button type="submit">Save Product</Button>
            </div>
        </form>
    );
};

const InventoryPage: React.FC = () => {
    const { products, addProduct, updateProduct, deleteProduct, loading } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

    const openAddModal = () => {
        setEditingProduct(undefined);
        setIsModalOpen(true);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };
    
    const handleDelete = async (productId: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            await deleteProduct(productId);
        }
    };

    const handleFormSubmit = async (data: Omit<Product, 'id'> | Product) => {
        if (editingProduct && 'id' in data) {
            await updateProduct(data as Product);
        } else {
            await addProduct(data as Omit<Product, 'id'>);
        }
        setIsModalOpen(false);
        setEditingProduct(undefined);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Inventory Management</h1>
                <Button onClick={openAddModal}>
                    <ICONS.Plus className="w-5 h-5"/>
                    Add Product
                </Button>
            </div>

            {loading ? <p>Loading inventory...</p> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map(product => (
                        <Card key={product.id} className="relative group">
                            {product.stock <= product.lowStockThreshold && (
                                <span className="absolute top-4 right-4 text-xs bg-red-500 text-white font-bold py-1 px-2 rounded-full">LOW STOCK</span>
                            )}
                            <img src={product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : 'https://picsum.photos/400'} alt={product.name} className="w-full h-40 object-cover rounded-lg mb-4"/>
                            <h3 className="text-xl font-semibold text-white">{product.name}</h3>
                            <p className="text-gray-400">{product.category}</p>
                            <div className="flex justify-between items-end mt-4">
                                <div>
                                    <p className="text-2xl font-light text-cyber-green">${product.price.toFixed(2)}</p>
                                    <p className="text-sm text-gray-400">In Stock: {product.stock}</p>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button variant="secondary" size="sm" onClick={() => openEditModal(product)}><ICONS.Edit className="w-4 h-4"/></Button>
                                    <Button variant="danger" size="sm" onClick={() => handleDelete(product.id)}><ICONS.Trash className="w-4 h-4"/></Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
            
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProduct ? 'Edit Product' : 'Add New Product'}>
                <ProductForm product={editingProduct} onFormSubmit={handleFormSubmit} onCancel={() => setIsModalOpen(false)}/>
            </Modal>
        </div>
    );
};

export default InventoryPage;