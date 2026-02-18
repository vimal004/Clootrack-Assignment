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
  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-24 z-10">
        <div className="flex items-center space-x-2 w-full md:w-auto">
             <div className="relative w-full md:w-64">
                <input
                    type="text"
                    placeholder="Search tickets..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    value={filter.search}
                    onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
             </div>
        </div>

        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <select
            className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filter.category}
            onChange={(e) => setFilter({ ...filter, category: e.target.value })}
          >
            <option value="">Category: All</option>
            <option value="billing">Billing</option>
            <option value="technical">Technical</option>
            <option value="account">Account</option>
            <option value="general">General</option>
          </select>
          <select
            className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filter.priority}
            onChange={(e) => setFilter({ ...filter, priority: e.target.value })}
          >
            <option value="">Priority: All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          <select
            className="px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          >
            <option value="">Status: All</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
            {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className={`group bg-white p-5 rounded-xl shadow-sm border transition-all duration-200 hover:shadow-md ${
                  ticket.priority === 'critical' ? 'border-red-200 hover:border-red-300' :
                  ticket.priority === 'high' ? 'border-orange-200 hover:border-orange-300' :
                  'border-gray-100 hover:border-blue-200'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-start space-x-3">
                    <span
                        className={`mt-1 h-3 w-3 rounded-full flex-shrink-0 ${
                            ticket.priority === 'critical' ? 'bg-red-500' :
                            ticket.priority === 'high' ? 'bg-orange-500' :
                            ticket.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                    ></span>
                    <div>
                        <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">{ticket.title}</h3>
                        <p className="text-gray-500 text-sm line-clamp-2 mt-1">
                            {ticket.description}
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                     <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide ${
                            ticket.priority === "critical" ? "bg-red-100 text-red-800" :
                            ticket.priority === "high" ? "bg-orange-100 text-orange-800" :
                            ticket.priority === "medium" ? "bg-yellow-100 text-yellow-800" :
                            "bg-green-100 text-green-800"
                        }`}
                        >
                        {ticket.priority}
                    </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-50">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center px-2 py-1 bg-gray-100 rounded text-xs font-medium uppercase text-gray-600">
                        {ticket.category}
                    </span>
                    <span className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {new Date(ticket.created_at).toLocaleDateString()}
                    </span>
                </div>

                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Status:</span>
                    <select
                    value={ticket.status}
                    onChange={(e) =>
                        handleStatusChange(ticket.id, e.target.value)
                    }
                    className={`text-sm font-medium border-none focus:ring-0 cursor-pointer py-0 pl-0 pr-6 bg-transparent ${
                        ticket.status === 'open' ? 'text-green-600' :
                        ticket.status === 'in_progress' ? 'text-blue-600' :
                        'text-gray-600'
                    }`}
                    >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                    </select>
                </div>
              </div>
            </div>
          ))}
          {tickets.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900">No tickets found</h3>
                <p className="text-gray-500 mt-1">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
