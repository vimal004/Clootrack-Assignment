import React, { useState, useEffect } from "react";
import { getStats } from "../api";
import { TicketStats } from "../types";

export const StatsDashboard: React.FC = () => {
  const [stats, setStats] = useState<TicketStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to load stats", error);
      }
    };
    fetchStats();

    // Auto refresh every 30s
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!stats)
    return <div className="p-4 bg-gray-100 rounded">Loading stats...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-white p-4 rounded shadow-sm">
        <h3 className="text-gray-500 text-sm">Total Tickets</h3>
        <p className="text-2xl font-bold">{stats.total_tickets}</p>
      </div>
      <div className="bg-white p-4 rounded shadow-sm">
        <h3 className="text-gray-500 text-sm">Open Tickets</h3>
        <p className="text-2xl font-bold text-green-600">
          {stats.open_tickets}
        </p>
      </div>
      <div className="bg-white p-4 rounded shadow-sm">
        <h3 className="text-gray-500 text-sm">Avg Tickets/Day</h3>
        <p className="text-2xl font-bold">{stats.avg_tickets_per_day}</p>
      </div>
      <div className="bg-white p-4 rounded shadow-sm col-span-1 md:col-span-1">
        <h3 className="text-gray-500 text-sm mb-2">Priority Breakdown</h3>
        <div className="space-y-1 text-xs">
          {Object.entries(stats.priority_breakdown).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="capitalize">{key}</span>
              <span className="font-semibold">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
