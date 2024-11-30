import React, { useMemo } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AnalyticsDashboard = ({ items, storeName = 'All Stores' }) => {
  const categoryMargins = useMemo(() => {
    const margins = {};
    items.forEach(item => {
      if (!margins[item.category]) {
        margins[item.category] = {
          category: item.category,
          totalCost: 0,
          totalRevenue: 0,
          itemCount: 0
        };
      }
      margins[item.category].totalCost += item.quantity * (item.cost || item.price * 0.6); // Estimated cost
      margins[item.category].totalRevenue += item.quantity * item.price;
      margins[item.category].itemCount += 1;
    });
    
    return Object.values(margins).map(m => ({
      ...m,
      margin: ((m.totalRevenue - m.totalCost) / m.totalRevenue * 100).toFixed(2)
    }));
  }, [items]);

  const popularItems = useMemo(() => {
    return [...items]
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)
      .map(item => ({
        name: item.name,
        value: item.quantity
      }));
  }, [items]);

  const turnoverRates = useMemo(() => {
    return items.map(item => ({
      name: item.name,
      rate: ((item.quantity) / (item.minThreshold * 2) * 100).toFixed(2)
    })).sort((a, b) => b.rate - a.rate);
  }, [items]);

  // Mock sales trend data - you can replace this with real data
  const mockSalesData = [
    { month: 'Jan', sales: 4000 },
    { month: 'Feb', sales: 3000 },
    { month: 'Mar', sales: 2000 },
    { month: 'Apr', sales: 2780 },
    { month: 'May', sales: 1890 },
    { month: 'Jun', sales: 2390 },
  ];

  const totalInventoryValue = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  }, [items]);

  const averageMargin = useMemo(() => {
    if (categoryMargins.length === 0) return 0;
    return (categoryMargins.reduce((sum, cat) => sum + parseFloat(cat.margin), 0) / categoryMargins.length).toFixed(2);
  }, [categoryMargins]);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="text-gray-500 text-sm">Total Inventory Value</h4>
          <p className="text-2xl font-bold text-green-600">${totalInventoryValue.toFixed(2)}</p>
          <p className="text-sm text-gray-600">{storeName}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="text-gray-500 text-sm">Average Margin</h4>
          <p className="text-2xl font-bold text-blue-600">{averageMargin}%</p>
          <p className="text-sm text-gray-600">Across all categories</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="text-gray-500 text-sm">Total Items</h4>
          <p className="text-2xl font-bold text-purple-600">{items.length}</p>
          <p className="text-sm text-gray-600">In inventory</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Sales Trends - {storeName}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockSalesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="sales" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Most Popular Items - {storeName}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={popularItems}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {popularItems.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Profit Margins by Category - {storeName}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryMargins}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="margin" fill="#82ca9d" name="Margin %" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Stock Turnover Rates - {storeName}</h3>
          <div className="overflow-auto h-[300px]">
            <table className="w-full">
              <thead className="sticky top-0 bg-white">
                <tr>
                  <th className="text-left p-2">Item</th>
                  <th className="text-left p-2">Turnover Rate</th>
                </tr>
              </thead>
              <tbody>
                {turnoverRates.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">{item.rate}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;