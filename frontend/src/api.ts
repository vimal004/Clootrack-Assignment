import axios from "axios";
import { Ticket, TicketStats, ClassificationResult } from "./types";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const client = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getTickets = async (params?: Record<string, any>) => {
  const response = await client.get<Ticket[]>("/tickets/", { params });
  return response.data;
};

export const createTicket = async (data: Partial<Ticket>) => {
  const response = await client.post<Ticket>("/tickets/", data);
  return response.data;
};

export const updateTicket = async (id: number, data: Partial<Ticket>) => {
  const response = await client.patch<Ticket>(`/tickets/${id}/`, data);
  return response.data;
};

export const getStats = async () => {
  const response = await client.get<TicketStats>("/tickets/stats/");
  return response.data;
};

export const classifyTicket = async (description: string) => {
  const response = await client.post<ClassificationResult>(
    "/tickets/classify/",
    { description },
  );
  return response.data;
};
