
import type { User, Product, CartItem, Sale } from '../types';

// Mock Data
let users: User[] = [
    { id: '1', email: 'admin@saif.cafe', role: 'admin' },
    { id: '2', email: 'cashier@saif.cafe', role: 'cashier' },
];

let products: Product[] = [
    { id: 'p1', name: 'Espresso', price: 2.50, stock: 100, category: 'Coffee', imageUrls: ['https://picsum.photos/seed/espresso/400', 'https://picsum.photos/seed/espresso_shot/400', 'https://picsum.photos/seed/coffee_beans/400'], lowStockThreshold: 10 },
    { id: 'p2', name: 'Latte', price: 3.50, stock: 8, category: 'Coffee', imageUrls: ['https://picsum.photos/seed/latte/400', 'https://picsum.photos/seed/latte_art/400'], lowStockThreshold: 10 },
    { id: 'p3', name: 'Croissant', price: 2.75, stock: 40, category: 'Pastry', imageUrls: ['https://picsum.photos/seed/croissant/400'], lowStockThreshold: 5 },
    { id: 'p4', name: 'Muffin', price: 3.00, stock: 35, category: 'Pastry', imageUrls: ['https://picsum.photos/seed/muffin/400', 'https://picsum.photos/seed/blueberry_muffin/400'], lowStockThreshold: 5 },
    { id: 'p5', name: 'Iced Tea', price: 3.25, stock: 50, category: 'Drinks', imageUrls: ['https://picsum.photos/seed/tea/400', 'https://picsum.photos/seed/ice_tea/400'], lowStockThreshold: 15 },
    { id: 'p6', name: 'Sandwich', price: 7.50, stock: 20, category: 'Food', imageUrls: ['https://picsum.photos/seed/sandwich/400', 'https://picsum.photos/seed/club_sandwich/400'], lowStockThreshold: 5 },
];

let sales: Sale[] = [
  {id: 's1', total: 6, createdAt: new Date(Date.now() - 86400000 * 5), items: [{productId: 'p1', quantity: 1, price: 2.5}, {productId: 'p3', quantity: 1, price: 2.75}]},
  {id: 's2', total: 7, createdAt: new Date(Date.now() - 86400000 * 3), items: [{productId: 'p2', quantity: 2, price: 3.5}]},
  {id: 's3', total: 10.75, createdAt: new Date(Date.now() - 86400000 * 1), items: [{productId: 'p6', quantity: 1, price: 7.5}, {productId: 'p5', quantity: 1, price: 3.25}]},
];

const simulateDelay = <T,>(data: T): Promise<T> => new Promise(resolve => setTimeout(() => resolve(data), 500));
const simulateError = () => new Promise((_, reject) => setTimeout(() => reject(new Error('API Error')), 500));

// Auth
export const login = (email: string, pass: string): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = users.find(u => u.email === email);
            // In a real app, you'd check the password hash
            if (user) {
                localStorage.setItem('authUser', JSON.stringify(user));
                resolve(user);
            } else {
                reject(new Error('Invalid credentials'));
            }
        }, 500);
    });
};

export const logout = () => {
    localStorage.removeItem('authUser');
};

export const getAuthenticatedUser = (): User | null => {
    const user = localStorage.getItem('authUser');
    return user ? JSON.parse(user) : null;
}

// Products
export const getProducts = (): Promise<Product[]> => simulateDelay([...products]);
export const getProduct = (id: string): Promise<Product | undefined> => simulateDelay(products.find(p => p.id === id));

export const addProduct = (productData: Omit<Product, 'id'>): Promise<Product> => {
    const newProduct: Product = { ...productData, id: `p${Date.now()}` };
    products.push(newProduct);
    return simulateDelay(newProduct);
};

export const updateProduct = (productData: Product): Promise<Product> => {
    products = products.map(p => p.id === productData.id ? productData : p);
    return simulateDelay(productData);
};

export const deleteProduct = (id: string): Promise<{ success: boolean }> => {
    products = products.filter(p => p.id !== id);
    return simulateDelay({ success: true });
};

// Sales
export const getSales = (): Promise<Sale[]> => simulateDelay([...sales]);

export const addSale = (cartItems: CartItem[]): Promise<Sale> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Transaction-like check
            for (const item of cartItems) {
                const productInStock = products.find(p => p.id === item.id);
                if (!productInStock || productInStock.stock < item.quantity) {
                    return reject(new Error(`Not enough stock for ${item.name}`));
                }
            }

            // Update stock
            cartItems.forEach(item => {
                const productInStock = products.find(p => p.id === item.id);
                if(productInStock) {
                    productInStock.stock -= item.quantity;
                }
            });

            const newSale: Sale = {
                id: `s${Date.now()}`,
                items: cartItems.map(item => ({ productId: item.id, quantity: item.quantity, price: item.price })),
                total: cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
                createdAt: new Date(),
            };
            sales.push(newSale);
            resolve(newSale);
        }, 500);
    });
};