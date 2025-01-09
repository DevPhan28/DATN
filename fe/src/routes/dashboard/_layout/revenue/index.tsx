import Header from '@/components/layoutAdmin/header/header';
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/_layout/revenue/')({
  component: Revenue,
})
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";


function Revenue() {
  const data = [
    { month: "Jan", revenue: 2500 },
    { month: "Feb", revenue: 3000 },
    { month: "Mar", revenue: 2000 },
    { month: "Apr", revenue: 2780 },
    { month: "May", revenue: 1890 },
    { month: "Jun", revenue: 2390 },
    { month: "Jul", revenue: 3490 },
    { month: "Aug", revenue: 4000 },
    { month: "Sep", revenue: 3000 },
    { month: "Oct", revenue: 2000 },
    { month: "Nov", revenue: 2780 },
    { month: "Dec", revenue: 1890 },
  ];


  const haha = [
    { name: "Thành công", value: 78 },
    { name: "Thất bại", value: 22 },
  ];
  const hihi = [
    { name: "Thành công", value: 71 }, // % Thành công
    { name: "Thất bại", value: 29 },  // % Thất bại
  ];

  const COLORS = ["#0088FE", "#FF8042"];
  // Hàm tuỳ chỉnh để hiển thị label
  const renderLabel = ({ name, value }) => `${value}%`;
  return (
    <div>
      <Header title="Tổng Doanh Thu" />
      <div className="mt-4 mx-6 flex flex-col gap-1 rounded-lg border border-gray-200 bg-ui-bg-base px-6 py-4">
        {/* Main Container */}
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-4 space-y-4">
            {/* Tổng doanh thu */}
            <div className="flex gap-2 justify-between">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-bold mb-3">Tổng doanh thu</h2>
                <p className="text-2xl font-bold text-red-500">1.285.550.630 đ</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="text-lg font-bold mb-3">Số đơn hàng</h2>
                <p className="font-semibold text-xl">1.195</p>
              </div>
            </div>
            {/* tổng đơn hàng */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-bold mb-3">Tổng đơn hàng</h2>
              <div className="flex items-center justify-center">
                <div className="w-1/2">
                  <p className="text-green-500 font-bold">Thành công: 1.001.999.980 đ</p>
                  <p className="text-red-500 font-bold">Thất bại: 283.550.650 đ</p>
                </div>
                {/* Biểu đồ tròn */}
                <PieChart width={200} height={200}>
                  <Pie
                    data={hihi}
                    cx="50%"
                    cy="50%"
                    outerRadius={60}
                    dataKey="value"
                    label={renderLabel} // Hiển thị nhãn và %
                    labelLine={true} // Hiển thị đường chỉ dẫn
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </div>
            </div>
            {/* Tổng tiền đơn hàng */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-lg font-bold mb-3">Tổng tiền đơn hàng</h2>
              <div className="flex items-center">
                <div className="w-1/2">
                  <p className="text-green-500 font-bold">Thành công: 1.001.999.980 đ</p>
                  <p className="text-red-500 font-bold">Thất bại: 283.550.650 đ</p>
                </div>
                <div className="w-1/2 flex justify-center">
                  {/* Tăng kích thước biểu đồ */}
                  <PieChart width={200} height={200}>
                    <Pie
                      data={haha}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      fill="#8884d8"
                      label={renderLabel} // Hiển thị nhãn
                      labelLine={true} // Vẽ đường nhãn
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="col-span-8 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-3">
              Biểu đồ doanh thu theo tháng hiện tại
            </h2>
            <div className="h-64 bg-gray-100">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}