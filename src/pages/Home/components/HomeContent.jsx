import React from 'react'
import { 
    Home, 
    Utensils, 
    Calendar, 
    MessageSquare, 
    DollarSign,
    Search,
    Plus,
    ChevronLeft,
    ChevronRight,
    Settings,
    LogOut
  } from 'lucide-react';
  import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';
  
  // Sample data for charts
  const earningsData = [
    { month: 'Jan', value: 50 },
    { month: 'Feb', value: 40 },
    { month: 'Mar', value: 60 },
    { month: 'Apr', value: 40 },
    { month: 'May', value: 55 },
    { month: 'Jun', value: 30 },
    { month: 'Jul', value: 45 },
    { month: 'Aug', value: 65 },
    { month: 'Sep', value: 70 }
  ];
  
  const ordersData = [
    { month: 'Jan', value: 80 },
    { month: 'Feb', value: 85 },
    { month: 'Mar', value: 82 },
    { month: 'Apr', value: 80 },
    { month: 'May', value: 81 },
    { month: 'Jun', value: 83 },
    { month: 'Jul', value: 82 }
  ];

const HomeContent = () => {
    return (
      <div className="space-y-6 py-4 px-6">
        {/* Stats Card */}
        <div className="bg-white p-6 w-fit rounded-lg shadow">
          <div className="flex flex-col items-center space-x-4">
            <div className='flex gap-10 items-center'> 
            <div>
              <h3 className="text-sm text-gray-500">Footfall Today</h3>
              <p className="text-3xl font-medium">40,689</p>
            </div>
            <div><img src="/assets/person.svg" className='w-10' alt="" /></div>
            </div>
            <div className="text-green-500 text-sm pt-6">
              ↑ 8.5% Up from yesterday
            </div>
          </div>
        </div>
  
        {/* Charts */}
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Orders Fulfilled</h3>
            <BarChart width={500} height={300} data={ordersData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4F46E5" />
            </BarChart>
          </div>
  
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium mb-4">Total Earnings</h3>
            <LineChart width={500} height={300} data={earningsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#4F46E5" />
            </LineChart>
          </div>
        </div>
      </div>
    );
  };

export default HomeContent
