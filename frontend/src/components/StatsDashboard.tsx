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
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
        ))}
      </div>
    );

  const StatCard = ({ title, value, icon, color }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4 transition hover:shadow-md">
      <div className={`p-3 rounded-full ${color}`}>{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Tickets"
          value={stats.total_tickets}
          color="bg-blue-50 text-blue-600"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          }
        />
        <StatCard
          title="Open Tickets"
          value={stats.open_tickets}
          color="bg-green-50 text-green-600"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />
        <StatCard
          title="Avg Tickets/Day"
          value={stats.avg_tickets_per_day}
          color="bg-purple-50 text-purple-600"
          icon={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-900 font-semibold mb-4 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 00-1-1H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 10-2 0v2a1 1 0 102 0V9z"
                clipRule="evenodd"
              />
            </svg>
            Priority Breakdown
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.priority_breakdown).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span
                    className={`w-2 h-2 rounded-full mr-2 ${
                      key === "critical"
                        ? "bg-red-500"
                        : key === "high"
                          ? "bg-orange-500"
                          : key === "medium"
                            ? "bg-yellow-500"
                            : "bg-green-500"
                    }`}
                  ></span>
                  <span className="capitalize text-gray-600 font-medium">
                    {key}
                  </span>
                </div>
                <span className="font-semibold text-gray-900 bg-gray-50 px-2 py-0.5 rounded text-sm">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-900 font-semibold mb-4 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            Category Breakdown
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.category_breakdown).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="w-2 h-2 rounded-full mr-2 bg-blue-400"></span>
                  <span className="capitalize text-gray-600 font-medium">
                    {key}
                  </span>
                </div>
                <span className="font-semibold text-gray-900 bg-gray-50 px-2 py-0.5 rounded text-sm">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
