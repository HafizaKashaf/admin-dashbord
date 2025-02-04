"use client";

import ProtectedRoute from "@/app/components/protectedRoute";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

interface Order {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  country: string;
  city: string;
  address1: string;
  address2: string;
  phone: number;
  zipCode: string;
  total: number;
  discount: number;
  status: string | null;
  orderDate: string;
  cartItems: {
      name: string; image: string 
}[];
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await client.fetch(
          `*[_type == 'order']{
            _id,
            firstName,
            lastName,
            email,
            company,
            country,
            city,
            address1,
            address2,
            phone,
            zipCode,
            total,
            discount,
            status,
            quantity,
            orderDate,
            cartItems[] -> { name, image }
          }`
        );
        setOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders =
    filter === "All" ? orders : orders.filter((order) => order.status === filter);

  const toggleOrderDetails = (orderId: string) => {
    setSelectedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const handleDelete = async (orderId: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonColor: "#3085d6",
      cancelButtonText: "No, keep it",
    });
    if (!result.isConfirmed) return;

    try {
      await client.delete(orderId);
      setOrders((prev) => prev.filter((order) => order._id !== orderId));
      Swal.fire("Deleted!", "The order has been removed.", "success");
    } catch (error) {
        console.error("Error deleting order:", error);
      Swal.fire("Error!", "Failed to delete the order.", "error");
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await client.patch(orderId).set({ status: newStatus }).commit();
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      if(newStatus === 'dispatched'){ Swal.fire('Order Dispatched!', 'The order has been dispatched', 'success') 

      }
      else if(newStatus === 'cancelled'){ Swal.fire('Order Cancelled!', 'The order has been cancelled', "error")

       }
       else if(newStatus === 'completed'){ Swal.fire('Order Completed!', 'The order has been completed', 'success')

        }
        else if(newStatus === 'processing'){ Swal.fire('Order Processing!', 'The order is being processed', "success")
        }
        else if(newStatus === 'pending'){ Swal.fire('Order Pending!', 'The order is pending', 'success') }
    } catch (error) {
        console.error("Error deleting order:", error);
      Swal.fire("Error!", "Failed to update status.", "error");
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-gray-50">
        <nav className="bg-yellow-600 p-4 text-white flex justify-between items-center shadow-md">
          <h2 className="text-2xl font-bold tracking-wide">Admin Dashboard</h2>
          <div className="space-x-2">
            {["All", "pending", "processing", "completed", "cancelled", "dispatched"].map((status) => (
              <button
                key={status}
                className={`px-4 py-2 rounded-md transition-all font-medium shadow-sm border border-yellow-400 hover:bg-yellow-700 hover:border-yellow-500 ${
                  filter === status ? "bg-yellow-500 text-white" : "bg-yellow-400 text-gray-900"
                }`}
                onClick={() => setFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </nav>
  
        <div className="p-6">
          <h2 className="text-3xl font-semibold mb-6 text-gray-800">Orders</h2>
          <div className="overflow-auto bg-white rounded-lg shadow-md">
            <table className="w-full text-left border border-gray-200">
              <thead className="bg-yellow-100 border-b border-yellow-300 text-yellow-800 font-semibold">
                <tr>
                  <th className="p-3">ID</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Address</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr className="cursor-pointer hover:bg-gray-100 border-b transition-all" onClick={() => toggleOrderDetails(order._id)}>
                      <td className="p-3">{order._id}</td>
                      <td className="p-3">{order.firstName} {order.lastName}</td>
                      <td className="p-3">{order.address1}<br/>{order.address2}</td>
                      <td className="p-3">{new Date(order.orderDate).toLocaleDateString()}</td>
                      <td className="p-3">${order.total}</td>
                      <td className="p-3">
                        <select
                          value={order.status || "pending"}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="p-2 bg-yellow-100 border border-yellow-500 rounded-md shadow-sm focus:ring focus:ring-yellow-400"
                        >
                          {["pending", "processing", "completed", "cancelled", "dispatched"].map((status) => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3">
                        <button
                          className="p-2 bg-red-500 text-white rounded-md shadow-sm hover:bg-red-600 transition-all"
                          onClick={(e) => { e.stopPropagation(); handleDelete(order._id); }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                    {selectedOrderId === order._id && (
                      <tr className="bg-yellow-50 border border-yellow-100">
                        <td colSpan={7} className="p-4">
                          <h3 className="font-bold bg-yellow-500 text-xl p-2 rounded-md text-white">Order Details</h3>
                          <p className="pt-2 text-gray-800">Email: <strong>{order.email}</strong></p>
                          <p className="text-gray-800">Phone: <strong>{order.phone}</strong></p>
                          <p className="text-gray-800">City: <strong>{order.city}</strong></p>
                          <ul className="mt-2 space-y-2">
                            {order.cartItems.map((item, index) => (
                              <li key={index} className="flex items-center gap-4 justify-between p-2 border-b border-yellow-200">
                                <span className="text-gray-700 font-medium">{item.name}</span>
                                {item.image && <Image src={urlFor(item.image).url()} alt={item.name} width={50} height={50} className="rounded-md shadow-sm" />}
                              </li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
  
}
