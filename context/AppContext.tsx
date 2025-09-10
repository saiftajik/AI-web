
import React, { createContext, useState, useContext, useEffect, useCallback, ReactNode } from 'react';
import type { User, Product, CartItem, Sale } from '../types';
import { getProducts as apiGetProducts, getSales as apiGetSales, addProduct as apiAddProduct, updateProduct as apiUpdateProduct, deleteProduct as apiDeleteProduct, addSale as apiAddSale, login as apiLogin, logout as apiLogout } from '../services/mockApi';

interface AppContextType {
    user: User | null;
    products: Product[];
    sales: Sale[];
    cart: CartItem[];
    loading: boolean;
    error: string | null;
    login: (email: string, pass: string) => Promise<void>;
    logout: () => void;
    addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
    updateProduct: (product: Product) => Promise<void>;
    deleteProduct: (productId: string) => Promise<void>;
    addToCart: (product: Product) => void;
    removeFromCart: (productId: string) => void;
    updateCartQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    checkout: () => Promise<Sale | null>;
    fetchProducts: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [sales, setSales] = useState<Sale[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const fetchedProducts = await apiGetProducts();
            setProducts(fetchedProducts);
            setError(null);
        } catch (err) {
            setError('Failed to fetch products.');
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchSales = useCallback(async () => {
        try {
            setLoading(true);
            const fetchedSales = await apiGetSales();
            setSales(fetchedSales);
            setError(null);
        } catch (err) {
            setError('Failed to fetch sales.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProducts();
        fetchSales();
    }, [fetchProducts, fetchSales]);

    const login = async (email: string, pass: string) => {
        const loggedInUser = await apiLogin(email, pass);
        setUser(loggedInUser);
    };

    const logout = () => {
        apiLogout();
        setUser(null);
        clearCart();
    };
    
    const addProduct = async (productData: Omit<Product, 'id'>) => {
        const newProduct = await apiAddProduct(productData);
        setProducts(prev => [...prev, newProduct]);
    };

    const updateProduct = async (productData: Product) => {
        const updatedProduct = await apiUpdateProduct(productData);
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    };

    const deleteProduct = async (productId: string) => {
        await apiDeleteProduct(productId);
        setProducts(prev => prev.filter(p => p.id !== productId));
    };

    const addToCart = (product: Product) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: string) => {
        setCart(prevCart => prevCart.filter(item => item.id !== productId));
    };

    const updateCartQuantity = (productId: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
        } else {
            setCart(prevCart => prevCart.map(item =>
                item.id === productId ? { ...item, quantity } : item
            ));
        }
    };
    
    const clearCart = () => setCart([]);

    const checkout = async (): Promise<Sale | null> => {
        if (cart.length === 0) return null;
        try {
            const sale = await apiAddSale(cart);
            setSales(prev => [...prev, sale]);
            await fetchProducts(); // Re-fetch products to get updated stock
            clearCart();
            return sale;
        } catch (err) {
            setError("Checkout failed. Some items may be out of stock.");
            await fetchProducts(); // Sync state with backend
            return null;
        }
    };


    const value = {
        user,
        products,
        sales,
        cart,
        loading,
        error,
        login,
        logout,
        addProduct,
        updateProduct,
        deleteProduct,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        checkout,
        fetchProducts
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppContextProvider');
    }
    return context;
};
