
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAppContext } from '../context/AppContext';
import { Card } from './common/ui';

const ReportsPage: React.FC = () => {
    const { sales, products, loading } = useAppContext();

    const salesData = useMemo(() => {
        if (!sales.length || !products.length) return [];
        
        const productSales = new Map<string, { name: string; quantity: number; revenue: number }>();
        
        products.forEach(p => {
            productSales.set(p.id, { name: p.name, quantity: 0, revenue: 0 });
        });

        sales.forEach(sale => {
            sale.items.forEach(item => {
                if (productSales.has(item.productId)) {
                    const current = productSales.get(item.productId)!;
                    current.quantity += item.quantity;
                    current.revenue += item.price * item.quantity;
                }
            });
        });

        return Array.from(productSales.values()).sort((a, b) => b.revenue - a.revenue);

    }, [sales, products]);
    
    const totalRevenue = useMemo(() => sales.reduce((acc, sale) => acc + sale.total, 0), [sales]);
    const totalSales = sales.length;
    const topSeller = salesData[0] ? `${salesData[0].name} ($${salesData[0].revenue.toFixed(2)})` : 'N/A';

    if (loading) return <p>Loading reports...</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Reports & Analytics</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <h3 className="text-gray-400">Total Revenue</h3>
                    <p className="text-3xl font-bold text-cyber-green">${totalRevenue.toFixed(2)}</p>
                </Card>
                <Card>
                    <h3 className="text-gray-400">Total Sales</h3>
                    <p className="text-3xl font-bold text-white">{totalSales}</p>
                </Card>
                <Card>
                    <h3 className="text-gray-400">Top Selling Product</h3>
                    <p className="text-3xl font-bold text-violet-400 truncate">{topSeller}</p>
                </Card>
            </div>

            <Card>
                <h2 className="text-2xl font-bold mb-6">Product Performance</h2>
                <div style={{ width: '100%', height: 400 }}>
                    <ResponsiveContainer>
                        <BarChart
                            data={salesData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            barSize={30}
                        >
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
                            <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`}/>
                            <Tooltip
                                cursor={{fill: 'rgba(138, 43, 226, 0.1)'}}
                                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', color: '#ffffff' }}
                            />
                            <Legend wrapperStyle={{ color: '#ffffff' }} />
                            <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                            <Bar dataKey="revenue" name="Revenue ($)" fill="url(#colorRevenue)" />
                            <Bar dataKey="quantity" name="Units Sold" fill="url(#colorQuantity)" />
                             <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8A2BE2" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#8A2BE2" stopOpacity={0.2}/>
                                </linearGradient>
                                <linearGradient id="colorQuantity" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#39FF14" stopOpacity={0.8}/>
                                    <stop offset="95%" stopColor="#39FF14" stopOpacity={0.2}/>
                                </linearGradient>
                            </defs>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
};

export default ReportsPage;
