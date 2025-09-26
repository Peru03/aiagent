import React, { useEffect, useState } from "react";
import API from "../Config";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get role from localStorage
  // const role = localStorage.getItem("user.role");
  const userString = localStorage.getItem("user");

  // Parse the JSON string into an object
  const user = JSON.parse(userString);
  const queryString = new URLSearchParams(user).toString();
  console.log(queryString);

  // Access the role
  const role = user.role;
  // console.log("THIS IS ROWL" + role);

  // Fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    let url = `/orders?${queryString}`;

    try {
      const response = await API.get(url);
      setOrders(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order status (only admin)
  const handleStatusChange = async (orderId, newStatus) => {
    if (role !== "admin") return; // non-admin cannot update
    try {
      await API.put(`/orders/${orderId}`, { status: newStatus, user: user });
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Delete order (only admin)
  const handleDelete = async (orderId) => {
    if (role !== "admin") return; // non-admin cannot delete
    try {
      await API.delete(`/orders/${orderId}?${queryString}`);
      setOrders((prev) => prev.filter((order) => order.id !== orderId));
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Order ID</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Product</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Total Price</TableCell>
            <TableCell>Status</TableCell>
            {role === "admin" && <TableCell>Actions</TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{order.id}</TableCell>
              <TableCell>{order.customerName}</TableCell>
              <TableCell>{order.productName}</TableCell>
              <TableCell>{order.quantity}</TableCell>
              <TableCell>{order.total_price}</TableCell>
              <TableCell>
                {role === "admin" ? (
                  <Select
                    sx={{
                      minWidth: 100,
                      height: "50px",
                      fontSize: "12px",
                      bgcolor: "#f9f9f9",
                      borderRadius: "8px",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1976d2", // blue border
                      },
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1565c0", // darker blue on hover
                      },
                      "& .MuiSvgIcon-root": {
                        color: "#1976d2", // dropdown arrow color
                      },
                    }}
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order.id, e.target.value)
                    }
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Confirmed">Confirmed</MenuItem>
                    <MenuItem value="Shipped">Shipped</MenuItem>
                  </Select>
                ) : (
                  order.status
                )}
              </TableCell>
              {role === "admin" && (
                <TableCell>
                  <Button
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(order.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrderList;
