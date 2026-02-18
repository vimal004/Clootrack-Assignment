import React, { useState, useEffect } from "react";
import { createTicket, classifyTicket } from "../api";
import { Ticket } from "../types";

interface TicketFormProps {
  onTicketCreated: () => void;
}

export const TicketForm: React.FC<TicketFormProps> = ({ onTicketCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Ticket["category"]>("general");
  const [priority, setPriority] = useState<Ticket["priority"]>("medium");
  const [loading, setLoading] = useState(false);
  const [classifying, setClassifying] = useState(false);

  // Debounce description for auto-classification
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (description.length > 10) {
        setClassifying(true);
        try {
          const result = await classifyTicket(description);
          setCategory(result.suggested_category);
          setPriority(result.suggested_priority);
        } catch (error) {
          console.error("Classification failed", error);
        } finally {
          setClassifying(false);
        }
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [description]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createTicket({ title, description, category, priority });
      setTitle("");
      setDescription("");
      setCategory("general");
      setPriority("medium");
      onTicketCreated();
    } catch (error) {
      alert("Failed to create ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">New Ticket</h2>
        <div className="p-2 bg-blue-50 text-blue-600 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            placeholder="Brief summary of the issue"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={200}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
             Description
             {classifying && (
                <span className="ml-2 text-xs text-blue-600 animate-pulse flex items-center inline-flex">
                    <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    AI Analyzing...
                </span>
             )}
          </label>
          <textarea
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none"
            placeholder="Detailed explanation of the problem..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={5}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <div className="relative">
                <select
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none appearance-none bg-white"
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                >
                <option value="billing">Billing</option>
                <option value="technical">Technical</option>
                <option value="account">Account</option>
                <option value="general">General</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
            <div className="relative">
                <select
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none appearance-none bg-white"
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium py-2.5 rounded-lg hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-70 flex justify-center items-center"
          disabled={loading}
        >
          {loading ? (
             <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
             </>
          ) : "Submit Ticket"}
        </button>
      </form>
    </div>
  );
};
