
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Button, Card, Input, Modal } from './common/ui';
import { ICONS } from '../constants';
import type { Product, CartItem, Sale } from '../types';

const ProductCard: React.FC<{ product: Product; onAddToCart: (product: Product) => void; onImageClick: (product: Product) => void; }> = ({ product, onAddToCart, onImageClick }) => {
    const isLowStock = product.stock <= product.lowStockThreshold;
    return (
        <Card className="flex flex-col text-center relative overflow-hidden group border-dark-border hover:border-violet-500/50 transition-all duration-300">
            {isLowStock && (
                <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10">LOW STOCK</div>
            )}
             {product.imageUrls && product.imageUrls.length > 1 && (
                <div className="absolute top-2 left-2 bg-black/50 text-white text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm z-10">
                    {product.imageUrls.length} photos
                </div>
            )}
            <div className="relative cursor-pointer" onClick={() => onImageClick(product)}>
                <img src={product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : 'https://picsum.photos/400'} alt={product.name} className="w-full h-40 object-cover rounded-t-lg mb-4 group-hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="flex-grow">
                <h3 className="font-bold text-lg text-white">{product.name}</h3>
                <p className="text-gray-400">{product.category}</p>
                <p className="text-2xl font-light text-cyber-green mt-2">${product.price.toFixed(2)}</p>
                <p className="text-sm text-gray-500 mt-1">Stock: {product.stock}</p>
            </div>
            <Button onClick={() => onAddToCart(product)} className="mt-4 w-full" disabled={product.stock === 0}>
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
        </Card>
    );
};

const ImageCarouselModal: React.FC<{ images: string[]; onClose: () => void }> = ({ images, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const goToPrevious = (e: React.MouseEvent) => {
        e.stopPropagation();
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = (e: React.MouseEvent) => {
        e.stopPropagation();
        const isLastSlide = currentIndex === images.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    return (
        <Modal isOpen={true} onClose={onClose} title="Product Images">
            <div className="relative h-96">
                <img src={images[currentIndex]} alt={`Product image ${currentIndex + 1}`} className="w-full h-full object-contain rounded-lg" />
                <button onClick={goToPrevious} className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/80 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500">
                    &#10094;
                </button>
                <button onClick={goToNext} className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/80 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500">
                    &#10095;
                </button>
                 <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                    {currentIndex + 1} / {images.length}
                </div>
            </div>
        </Modal>
    );
};

const Cart: React.FC = () => {
    const { cart, removeFromCart, updateCartQuantity, clearCart, checkout } = useAppContext();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [receipt, setReceipt] = useState<Sale | null>(null);

    const total = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

    const handleCheckout = async () => {
        setIsCheckingOut(true);
        const generatedReceipt = await checkout();
        if (generatedReceipt) {
            setReceipt(generatedReceipt);
        }
        setIsCheckingOut(false);
    };
    
    const printReceipt = () => {
        const printWindow = window.open('', '_blank');
        if (printWindow && receipt) {
            printWindow.document.write('<html><head><title>Receipt</title>');
            printWindow.document.write('<style>body{font-family:monospace; margin:20px} .item{display:flex; justify-content:space-between} .total{font-weight:bold; margin-top:10px; border-top:1px dashed #000; padding-top:10px}</style>');
            printWindow.document.write('</head><body>');
            printWindow.document.write('<h1>SAIF Cafe Receipt</h1>');
            printWindow.document.write(`<p>Date: ${new Date(receipt.createdAt).toLocaleString()}</p>`);
            printWindow.document.write(`<p>Receipt ID: ${receipt.id}</p><hr/>`);
            receipt.items.forEach(item => {
                printWindow.document.write(`<div class="item"><span>${item.quantity}x (Product ID: ${item.productId})</span><span>$${(item.price * item.quantity).toFixed(2)}</span></div>`);
            });
            printWindow.document.write(`<div class="item total"><span>Total</span><span>$${receipt.total.toFixed(2)}</span></div>`);
            printWindow.document.write('</body></html>');
            printWindow.document.close();
            printWindow.print();
        }
    }

    if (receipt) {
        return (
            <Card className="h-full flex flex-col">
                <h2 className="text-2xl font-bold mb-4 text-center text-cyber-green">Checkout Successful!</h2>
                <div className="bg-gray-800 p-4 rounded-lg flex-grow text-sm font-mono">
                    <p>Date: {new Date(receipt.createdAt).toLocaleString()}</p>
                    <p>ID: {receipt.id}</p>
                    <hr className="my-2 border-gray-600"/>
                    {receipt.items.map(item => (
                        <div key={item.productId} className="flex justify-between">
                            <span>{item.quantity}x (ID:{item.productId})</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <hr className="my-2 border-gray-600"/>
                    <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span>${receipt.total.toFixed(2)}</span>
                    </div>
                </div>
                <div className="flex gap-2 mt-4">
                    <Button variant="secondary" onClick={printReceipt} className="w-full">Print</Button>
                    <Button onClick={() => setReceipt(null)} className="w-full">New Sale</Button>
                </div>
            </Card>
        );
    }
    
    return (
        <Card className="h-full flex flex-col">
            <h2 className="text-2xl font-bold mb-4">Cart</h2>
            {cart.length === 0 ? (
                <div className="flex-grow flex items-center justify-center text-gray-500">Cart is empty</div>
            ) : (
                <div className="flex-grow overflow-y-auto -mr-3 pr-3 space-y-3">
                    {cart.map(item => (
                        <div key={item.id} className="flex items-center justify-between bg-dark-border/50 p-2 rounded-lg">
                            <div>
                                <p className="font-semibold">{item.name}</p>
                                <p className="text-sm text-gray-400">${item.price.toFixed(2)}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => updateCartQuantity(item.id, item.quantity - 1)} className="p-1 rounded-full bg-gray-700 hover:bg-gray-600"><ICONS.Minus className="w-4 h-4"/></button>
                                <span>{item.quantity}</span>
                                <button onClick={() => updateCartQuantity(item.id, item.quantity + 1)} className="p-1 rounded-full bg-gray-700 hover:bg-gray-600"><ICONS.Plus className="w-4 h-4"/></button>
                                <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-400 ml-2"><ICONS.Trash className="w-4 h-4"/></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <div className="mt-auto pt-4 border-t border-dark-border">
                <div className="flex justify-between items-center font-bold text-xl mb-4">
                    <span>Total</span>
                    <span className="text-cyber-green">${total.toFixed(2)}</span>
                </div>
                <Button onClick={handleCheckout} disabled={cart.length === 0 || isCheckingOut} className="w-full text-lg">
                    {isCheckingOut ? 'Processing...' : 'Checkout'}
                </Button>
                 {cart.length > 0 && <Button onClick={clearCart} variant="danger" className="w-full mt-2">Clear Cart</Button>}
            </div>
        </Card>
    );
};

const DashboardPage: React.FC = () => {
    const { products, addToCart, loading } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [modalImages, setModalImages] = useState<string[] | null>(null);

    const handleImageClick = (product: Product) => {
        if (product.imageUrls && product.imageUrls.length > 0) {
            setModalImages(product.imageUrls);
        }
    };

    const handleCloseModal = () => {
        setModalImages(null);
    };

    const filteredProducts = useMemo(() => {
        return products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [products, searchTerm]);

    return (
        <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-full flex flex-col">
                <div className="relative mb-6">
                    <Input 
                        type="text" 
                        placeholder="Search products..." 
                        className="pl-12"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <ICONS.Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"/>
                </div>
                {loading ? <div className="flex-grow flex items-center justify-center">Loading Products...</div> : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 overflow-y-auto flex-grow">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} onAddToCart={addToCart} onImageClick={handleImageClick}/>
                        ))}
                    </div>
                )}
            </div>
            <div className="lg:col-span-1 h-full">
                <Cart />
            </div>
            {modalImages && <ImageCarouselModal images={modalImages} onClose={handleCloseModal} />}
        </div>
    );
};

export default DashboardPage;