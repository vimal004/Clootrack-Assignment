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
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-bold mb-4">Create New Ticket</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Title</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={200}
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 font-medium">Description</label>
          <textarea
            className="w-full border p-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
          />
          {classifying && (
            <p className="text-sm text-blue-500 mt-1">AI is analyzing...</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2 font-medium">Category</label>
            <select
              className="w-full border p-2 rounded"
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
            >
              <option value="billing">Billing</option>
              <option value="technical">Technical</option>
              <option value="account">Account</option>
              <option value="general">General</option>
            </select>
          </div>
          <div>
            <label className="block mb-2 font-medium">Priority</label>
            <select
              className="w-full border p-2 rounded"
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Ticket"}
        </button>
      </form>
    </div>
  );
};
