import { create } from "zustand";
import axiosInstance from "../lib/axios";

interface getAllEvents {
  searchQuery: string;
  location: string;
  category: string;
  page?: string;
  limit?: string;
}

interface EventStoreProps {
  isLoading: boolean;
  isLoadingDiscovery: boolean;
  error: any;
  currentEvents: any;
  searchQuery: string;
  location: string;
  category: string;
  currentPage: number;
  totalPages: number;
  totalEvents: number;
  currentEvent: any;
  setSearchQuery: (value: string) => void;
  setLocation: (value: string) => void;
  setCategory: (value: string) => void;
  getAllEvents: ({
    searchQuery,
    location,
    category,
    page,
    limit,
  }: getAllEvents) => Promise<void>;
  getEventById: (id: string) => Promise<void>;
}

export const useEventStore = create<EventStoreProps>((set) => ({
  isLoading: false,
  isLoadingDiscovery: false,
  error: null,
  currentEvents: null,
  searchQuery: "",
  location: "",
  category: "",
  currentPage: 1,
  totalPages: 1,
  totalEvents: 0,
  currentEvent: null,
  setSearchQuery: (value) => {
    set({ searchQuery: value });
  },
  setLocation: (value) => {
    set({ location: value });
  },
  setCategory: (value) => {
    set({ category: value });
  },
  getAllEvents: async ({ searchQuery, location, category, page, limit }) => {
    set({ isLoadingDiscovery: true, error: null });
    try {
      const response = await axiosInstance.get(
        `/event?search=${searchQuery}&&location=${location}&&category=${category}&&page=${page}&&limit=${limit}`,
      );
      console.log(response.data.events);
      console.log(response.data.meta.currentPage);
      console.log(response.data.meta.totalPages);
      console.log(response.data.meta.totalEvents);
      set({
        currentEvents: response.data.events,
        currentPage: response.data.meta.currentPage,
        totalPages: response.data.meta.totalPages,
        totalEvents: response.data.meta.totalEvents,
        isLoadingDiscovery: false,
      });
    } catch (error: any) {
      set({ error: error.response.data.message, isLoadingDiscovery: false });
    }
  },
  getEventById: async (id) => {
    set({ isLoading: true, error: null, currentEvent: null });
    try {
      const response = await axiosInstance.get(`/event/${id}`);
      console.log(response.data.event);
      set({ currentEvent: response.data.event });
    } catch (error: any) {
      set({ error: error.response.data.message, currentEvent: null });
    } finally {
      set({ isLoading: false });
    }
  },
}));
