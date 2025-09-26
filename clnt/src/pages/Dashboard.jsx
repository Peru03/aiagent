import { useEffect, useState } from "react";
import axios from "axios";
import API from "../Config";
import { Box, Typography, Paper } from "@mui/material";

export default function Dashboard() {
  const [stats, setStats] = useState({ ordersCount: 0, usersCount: 0 });
  const [loading, setLoading] = useState(true);
 const userString = localStorage.getItem("user");

  const user = JSON.parse(userString);
  const queryString = new URLSearchParams(user).toString();
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get(`/dashboard?${queryString}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, 
          },
          
        });
        console.log("DATA:");
        
        console.log(res.data);
        
        setStats(res.data); // { ordersCount: X, usersCount: Y }
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p>Loading stats...</p>;
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Paper sx={{ p: 2, width: 200, textAlign: "center" }}>Total Orders  {stats.ordersCount}</Paper>
        <Paper sx={{ p: 2, width: 200, textAlign: "center" }}>Total Users  {stats.usersCount}</Paper>
        {/* <Paper sx={{ p: 2, width: 200, textAlign: "center" }}>Messages</Paper> */}
      </Box>
    </Box>
  );
}
