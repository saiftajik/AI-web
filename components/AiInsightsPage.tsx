
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { getAiInsights } from '../services/geminiService';
import { Button, Card, Input } from './common/ui';

const AiInsightsPage: React.FC = () => {
    const { products, sales } = useAppContext();
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [insight, setInsight] = useState('');

    const handleQuery = async () => {
        if (!query.trim()) return;

        setIsLoading(true);
        setInsight('');
        try {
            const result = await getAiInsights(query, products, sales);
            setInsight(result);
        } catch (error) {
            console.error(error);
            setInsight('An error occurred while fetching insights.');
        } finally {
            setIsLoading(false);
        }
    };

    const quickQueries = [
        "What sold the most last week?",
        "Which products have low stock?",
        "What should I restock for the weekend?",
        "Summarize today's sales performance.",
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2 text-center">AI Business Insights</h1>
            <p className="text-gray-400 mb-8 text-center">Ask questions about your sales and inventory data in plain English.</p>

            <Card className="mb-6">
                <div className="flex gap-4">
                    <Input 
                        value={query} 
                        onChange={(e) => setQuery(e.target.value)} 
                        placeholder="e.g., 'What was my best selling pastry this month?'"
                        onKeyPress={(e) => e.key === 'Enter' && handleQuery()}
                    />
                    <Button onClick={handleQuery} disabled={isLoading}>
                        {isLoading ? 'Analyzing...' : 'Ask AI'}
                    </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                    {quickQueries.map(q => (
                         <button 
                            key={q}
                            onClick={() => setQuery(q)}
                            className="text-xs bg-dark-border px-3 py-1 rounded-full hover:bg-violet-500/50 transition-colors"
                        >
                            {q}
                        </button>
                    ))}
                </div>
            </Card>

            {isLoading && (
                <Card className="text-center">
                    <div className="animate-pulse">Analyzing your data...</div>
                </Card>
            )}

            {insight && (
                <Card className="border-violet-500/50">
                    <h2 className="text-xl font-semibold mb-3 text-violet-400">Insight:</h2>
                    <p className="text-gray-200 whitespace-pre-wrap">{insight}</p>
                </Card>
            )}
        </div>
    );
};

export default AiInsightsPage;
