import React, { useState, useEffect } from "react";
import { getTickets, updateTicket } from "../api";
import { Ticket } from "../types";

export const TicketList: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    status: "",
    priority: "",
    category: "",
    search: "",
  });

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = await getTickets(filter);
      setTickets(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [filter]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await updateTicket(id, { status: newStatus as any });
      fetchTickets();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Tickets</h2>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search..."
            className="border p-2 rounded"
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          />
          <select
            className="border p-2 rounded"
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          >
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className={`p-4 border rounded ${ticket.priority === "critical" ? "border-red-500 bg-red-50" : "border-gray-200"}`}
            >
              <div className="flex justify-between mb-2">
                <h3 className="font-bold text-lg">{ticket.title}</h3>
                <span
                  className={`px-2 py-1 rounded text-sm font-semibold capitalize ${ticket.priority === "high" ? "text-orange-600" : ""}`}
                >
                  {ticket.priority}
                </span>
              </div>
              <p className="text-gray-600 mb-2 truncate">
                {ticket.description}
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span className="capitalize bg-gray-100 px-2 py-1 rounded">
                  {ticket.category}
                </span>
                <select
                  value={ticket.status}
                  onChange={(e) =>
                    handleStatusChange(ticket.id, e.target.value)
                  }
                  className="bg-transparent border-none focus:ring-0 cursor-pointer underline"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
                <span>{new Date(ticket.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
          {tickets.length === 0 && (
            <p className="text-gray-500 text-center">No tickets found.</p>
          )}
        </div>
      )}
    </div>
  );
};
