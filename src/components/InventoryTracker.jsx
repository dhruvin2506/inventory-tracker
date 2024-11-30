import React, { useState, useEffect } from 'react';
import { PlusCircle, MinusCircle, AlertTriangle, Search, Download, LogOut, BarChart, PackageOpen, Store } from 'lucide-react';
import AnalyticsDashboard from './AnalyticsDashboard';

const USERS = [
  { 
    username: 'owner', 
    password: 'owner123', 
    role: 'owner',
    accessibleStores: 'all'
  },
  { 
    username: 'manager1', 
    password: 'manager123', 
    role: 'manager', 
    storeId: 1 
  },
  { 
    username: 'manager2', 
    password: 'manager123', 
    role: 'manager', 
    storeId: 2 
  },
  { 
    username: 'staff1', 
    password: 'staff123', 
    role: 'staff', 
    storeId: 1 
  }
];

const STORES = [
  { 
    id: 1, 
    name: 'Downtown Store', 
    location: '123 Main St',
    manager: 'manager1'
  },
  { 
    id: 2, 
    name: 'Westside Store', 
    location: '456 West Ave',
    manager: 'manager2'
  }
];

const LoginForm = ({ onSubmit, loginData, setLoginData }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
    <div className="absolute inset-0 bg-black opacity-50"></div>
    <div className="relative">
      <form onSubmit={onSubmit} className="bg-white p-8 rounded-lg shadow-2xl w-96 transform transition-all hover:scale-105">
        <div className="flex items-center justify-center mb-6">
          <PackageOpen className="h-12 w-12 text-blue-500" />
          <h2 className="text-3xl font-bold ml-2 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Inventory Login
          </h2>
        </div>
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Username"
              value={loginData.username}
              onChange={e => setLoginData({...loginData, username: e.target.value})}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={e => setLoginData({...loginData, password: e.target.value})}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
          </div>
          <button 
            type="submit"
            className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transform transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Login
          </button>
        </div>
        <div className="mt-6 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
          <p className="font-semibold mb-2">Demo Accounts:</p>
          <div className="space-y-1">
            <p className="flex items-center">
              <span className="font-medium text-blue-600">Owner:</span>
              <span className="ml-2">owner / owner123</span>
            </p>
            <p className="flex items-center">
              <span className="font-medium text-blue-600">Manager 1:</span>
              <span className="ml-2">manager1 / manager123</span>
            </p>
            <p className="flex items-center">
              <span className="font-medium text-blue-600">Manager 2:</span>
              <span className="ml-2">manager2 / manager123</span>
            </p>
          </div>
        </div>
      </form>
    </div>
  </div>
);

const StoreSelector = ({ selectedStore, setSelectedStore, stores, userRole }) => {
  if (userRole !== 'owner') return null;

  return (
    <div className="mb-4 flex items-center gap-2">
      <Store className="h-5 w-5 text-gray-400" />
      <select
        value={selectedStore}
        onChange={e => setSelectedStore(Number(e.target.value))}
        className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
      >
        {stores.map(store => (
          <option key={store.id} value={store.id}>
            {store.name} - {store.location}
          </option>
        ))}
      </select>
    </div>
  );
};
const InventoryTracker = () => {
  const [user, setUser] = useState(null);
  const [selectedStore, setSelectedStore] = useState(null);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem('inventoryItems');
    return savedItems ? JSON.parse(savedItems) : [
      { id: 1, name: 'Red Wine', category: 'Wine', quantity: 24, minThreshold: 10, price: 19.99, storeId: 1 },
      { id: 2, name: 'Vodka', category: 'Spirits', quantity: 12, minThreshold: 5, price: 24.99, storeId: 1 },
      { id: 3, name: 'IPA Beer', category: 'Beer', quantity: 48, minThreshold: 20, price: 6.99, storeId: 1 },
      { id: 4, name: 'Red Wine', category: 'Wine', quantity: 30, minThreshold: 10, price: 21.99, storeId: 2 },
      { id: 5, name: 'Whiskey', category: 'Spirits', quantity: 15, minThreshold: 5, price: 45.99, storeId: 2 }
    ];
  });
  
  const [actionLogs, setActionLogs] = useState(() => {
    const savedLogs = localStorage.getItem('actionLogs');
    return savedLogs ? JSON.parse(savedLogs) : [];
  });

  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [newItem, setNewItem] = useState({
    name: '',
    category: '',
    quantity: '',
    minThreshold: '',
    price: ''
  });

  useEffect(() => {
    if (user) {
      if (user.role === 'owner') {
        setSelectedStore(STORES[0].id);
      } else {
        setSelectedStore(user.storeId);
      }
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('inventoryItems', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('actionLogs', JSON.stringify(actionLogs));
  }, [actionLogs]);

  const logAction = (action, details) => {
    if (user) {
      setActionLogs(prev => [...prev, {
        timestamp: new Date().toISOString(),
        user: user.username,
        action,
        details,
        storeId: selectedStore
      }]);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const foundUser = USERS.find(u => 
      u.username === loginData.username && u.password === loginData.password
    );
    if (foundUser) {
      setUser(foundUser);
      if (foundUser.role !== 'owner') {
        setSelectedStore(foundUser.storeId);
      }
      setActionLogs(prev => [...prev, {
        timestamp: new Date().toISOString(),
        user: foundUser.username,
        action: 'login',
        details: `${foundUser.username} logged in`,
        storeId: foundUser.storeId || 'all'
      }]);
    } else {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    if (user) {
      logAction('logout', `${user.username} logged out`);
      setUser(null);
      setLoginData({ username: '', password: '' });
    }
  };

  const addStock = (id, amount) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, item.quantity + amount);
        logAction('stock_update', `Changed ${item.name} quantity by ${amount} (new total: ${newQuantity})`);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const handleAddItem = () => {
    if (newItem.name && newItem.category && newItem.quantity && newItem.minThreshold && newItem.price) {
      const newItemData = {
        id: Date.now(),
        ...newItem,
        storeId: selectedStore,
        quantity: parseInt(newItem.quantity),
        minThreshold: parseInt(newItem.minThreshold),
        price: parseFloat(newItem.price)
      };
      setItems([...items, newItemData]);
      logAction('item_added', `Added new item: ${newItem.name} to ${STORES.find(s => s.id === selectedStore)?.name}`);
      setNewItem({ name: '', category: '', quantity: '', minThreshold: '', price: '' });
    }
  };

  const updatePrice = (id, newPrice) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updatedPrice = parseFloat(newPrice) || item.price;
        logAction('price_update', `Updated price of ${item.name} to $${updatedPrice}`);
        return { ...item, price: updatedPrice };
      }
      return item;
    }));
  };

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const exportToCSV = () => {
    const headers = ['Store', 'Name', 'Category', 'Quantity', 'Min Threshold', 'Price'];
    const csvContent = [
      headers.join(','),
      ...filteredAndSortedItems.map(item => 
        [
          STORES.find(s => s.id === item.storeId)?.name,
          item.name,
          item.category,
          item.quantity,
          item.minThreshold,
          item.price
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-${STORES.find(s => s.id === selectedStore)?.name}.csv`;
    a.click();
    logAction('export', `Exported inventory for ${STORES.find(s => s.id === selectedStore)?.name}`);
  };

  if (!user) {
    return <LoginForm onSubmit={handleLogin} loginData={loginData} setLoginData={setLoginData} />;
  }

  const categories = [...new Set(items.map(item => item.category))];
  const filteredAndSortedItems = items
    .filter(item => 
      item.storeId === selectedStore &&
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      (filterCategory ? item.category === filterCategory : true)
    )
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      const direction = sortConfig.direction === 'asc' ? 1 : -1;
      return a[sortConfig.key] > b[sortConfig.key] ? direction : -direction;
    });

  const filteredActionLogs = actionLogs.filter(log => 
    user?.role === 'owner' ? true : log.storeId === selectedStore
  );

  const lowStockItems = filteredAndSortedItems.filter(item => item.quantity <= item.minThreshold);
  const totalValue = filteredAndSortedItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);

  const canEditPrice = user?.role === 'owner' || user?.role === 'manager';
  const canExport = user?.role === 'owner' || user?.role === 'manager';

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {user.role === 'owner' ? 'Multi-Store Inventory Management' : 'Store Inventory'}
                </h2>
                <p className="text-gray-600 mt-1">
                  Logged in as: <span className="font-medium text-blue-600">{user.username}</span> ({user.role})
                  <br />
                  {selectedStore && (
                    <>
                      Current Store: <span className="font-medium text-purple-600">
                        {STORES.find(s => s.id === selectedStore)?.name}
                      </span>
                      <br />
                    </>
                  )}
                  Store Value: <span className="font-medium text-green-600">${totalValue.toFixed(2)}</span>
                </p>
              </div>
              <div className="flex gap-3">
                {canExport && (
                  <>
                    <button 
                      onClick={() => setShowAnalytics(!showAnalytics)}
                      className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg flex items-center gap-2 hover:opacity-90 transition-all hover:scale-105"
                    >
                      <BarChart className="h-4 w-4" />
                      {showAnalytics ? 'Show Inventory' : 'Show Analytics'}
                    </button>
                    <button 
                      onClick={exportToCSV}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg flex items-center gap-2 hover:bg-green-600 transition-all hover:scale-105"
                    >
                      <Download className="h-4 w-4" />
                      Export CSV
                    </button>
                  </>
                )}
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2 hover:bg-red-600 transition-all hover:scale-105"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>

            <StoreSelector 
              selectedStore={selectedStore}
              setSelectedStore={setSelectedStore}
              stores={STORES}
              userRole={user.role}
            />
          </div>

          <div className="p-6">
            {showAnalytics ? (
              <AnalyticsDashboard 
                items={filteredAndSortedItems} 
                storeName={STORES.find(s => s.id === selectedStore)?.name}
              />
            ) : (
              <>
                {lowStockItems.length > 0 && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 animate-pulse">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    <p className="text-red-700 font-medium">
                      {lowStockItems.length} items are running low on stock in {STORES.find(s => s.id === selectedStore)?.name}
                    </p>
                  </div>
                )}

                <div className="flex gap-4 mb-6">
                  <div className="flex-1 flex gap-4">
                    <div className="relative flex-1">
                      <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
                      <input
                        placeholder="Search items..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                      />
                    </div>
                    <select
                      value={filterCategory}
                      onChange={e => setFilterCategory(e.target.value)}
                      className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    >
                      <option value="">All Categories</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 mb-6">
                  <input
                    placeholder="Item Name"
                    value={newItem.name}
                    onChange={e => setNewItem({...newItem, name: e.target.value})}
                    className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                  <input
                    placeholder="Category"
                    value={newItem.category}
                    onChange={e => setNewItem({...newItem, category: e.target.value})}
                    className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={newItem.quantity}
                    onChange={e => setNewItem({...newItem, quantity: e.target.value})}
                    className="w-32 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                  <input
                    type="number"
                    placeholder="Min Threshold"
                    value={newItem.minThreshold}
                    onChange={e => setNewItem({...newItem, minThreshold: e.target.value})}
                    className="w-32 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    value={newItem.price}
                    onChange={e => setNewItem({...newItem, price: e.target.value})}
                    className="w-32 px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                  <button 
                    onClick={handleAddItem}
                    
                     className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all hover:scale-105"
                  >
                    Add Item
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full border-collapse bg-white shadow-sm hover:shadow transition-shadow rounded-lg">
                    <thead>
                      <tr className="bg-gray-50">
                        <th 
                          onClick={() => handleSort('name')}
                          className="p-4 text-left border-b cursor-pointer hover:bg-gray-100"
                        >
                          Name {sortConfig.key === 'name' && (
                            <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </th>
                        <th 
                          onClick={() => handleSort('category')}
                          className="p-4 text-left border-b cursor-pointer hover:bg-gray-100"
                        >
                          Category {sortConfig.key === 'category' && (
                            <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </th>
                        <th 
                          onClick={() => handleSort('quantity')}
                          className="p-4 text-left border-b cursor-pointer hover:bg-gray-100"
                        >
                          Quantity {sortConfig.key === 'quantity' && (
                            <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </th>
                        <th 
                          onClick={() => handleSort('minThreshold')}
                          className="p-4 text-left border-b cursor-pointer hover:bg-gray-100"
                        >
                          Min Threshold {sortConfig.key === 'minThreshold' && (
                            <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </th>
                        <th 
                          onClick={() => handleSort('price')}
                          className="p-4 text-left border-b cursor-pointer hover:bg-gray-100"
                        >
                          Price {sortConfig.key === 'price' && (
                            <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </th>
                        <th className="p-4 text-left border-b">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSortedItems.map(item => (
                        <tr 
                          key={item.id} 
                          className={`${item.quantity <= item.minThreshold ? 'bg-red-50' : ''} hover:bg-gray-50 transition-colors`}
                        >
                          <td className="p-4 border-b">{item.name}</td>
                          <td className="p-4 border-b">{item.category}</td>
                          <td className="p-4 border-b">{item.quantity}</td>
                          <td className="p-4 border-b">{item.minThreshold}</td>
                          <td className="p-4 border-b">
                            {canEditPrice ? (
                              <input
                                type="number"
                                step="0.01"
                                value={item.price || ''}
                                onChange={e => updatePrice(item.id, e.target.value)}
                                className="w-24 px-2 py-1 border-2 border-gray-200 rounded focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                              />
                            ) : (
                              `$${item.price?.toFixed(2)}`
                            )}
                          </td>
                          <td className="p-4 border-b">
                            <div className="flex gap-2">
                              <button 
                                onClick={() => addStock(item.id, -1)}
                                className="p-2 border-2 border-gray-200 rounded-lg hover:bg-red-50 hover:border-red-200 transition-all"
                              >
                                <MinusCircle className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => addStock(item.id, 1)}
                                className="p-2 border-2 border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-200 transition-all"
                              >
                                <PlusCircle className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {user.role !== 'staff' && !showAnalytics && (
                  <div className="mt-8">
                    <h3 className="text-xl font-bold mb-4">
                      Action Logs - {user.role === 'owner' ? 'All Stores' : STORES.find(s => s.id === selectedStore)?.name}
                    </h3>
                    <div className="max-h-60 overflow-y-auto bg-white rounded-lg shadow-sm">
                      <table className="w-full">
                        <thead className="bg-gray-50 sticky top-0">
                          <tr>
                            <th className="p-3 text-left">Time</th>
                            <th className="p-3 text-left">Store</th>
                            <th className="p-3 text-left">User</th>
                            <th className="p-3 text-left">Action</th>
                            <th className="p-3 text-left">Details</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredActionLogs.map((log, index) => (
                            <tr key={index} className="border-b hover:bg-gray-50 transition-colors">
                              <td className="p-3">{new Date(log.timestamp).toLocaleString()}</td>
                              <td className="p-3">{STORES.find(s => s.id === log.storeId)?.name || 'All Stores'}</td>
                              <td className="p-3">{log.user}</td>
                              <td className="p-3">{log.action}</td>
                              <td className="p-3">{log.details}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryTracker;