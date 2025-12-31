import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useChatStore = create((set, get) => ({
    allContacts: [],
    chats: [],
    messages: [],
    activeTab: "chats",
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isSoundEnabled: localStorage.getItem("isSoundEnabled") === true,

    toggleSound: () => {
        localStorage.setItem("isSoundEnabled", !get().isSoundEnabled)
        set({isSoundEnabled: !get().isSoundEnabled})
    },
    setActiveTab: (tab) => set({activeTab: tab}),
    setSelectedUser: (user) => set({selectedUser: user}),
    getMessagesWithUserId: async(userId) => {
        set({isMessagesLoading: true});
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({messages: res.data})
        } catch (error) {
            console.error(error)
            toast.error(error?.response?.data?.message || "Failed to load messages")
        } finally {
            set({isMessagesLoading: false});
        }
    },
    sendMessage: async(messageData) => {
  const { selectedUser, messages, chats, allContacts } = get();
  try {
    const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);

    // 1. Update messages state
    set({ messages: [...messages, res.data] });

    // 2. Update lastMessage in chats array
    const updatedChats = chats.map(chat => {
      if (chat._id === selectedUser._id) {
        return { ...chat, lastMessage: res.data };
      }
      return chat;
    });
    set({ chats: updatedChats });

    // 3. Update lastMessage in allContacts array
    const updatedContacts = allContacts.map(contact => {
      if (contact._id === selectedUser._id) {
        return { ...contact, lastMessage: res.data };
      }
      return contact;
    });
    set({ allContacts: updatedContacts });

  } catch (error) {
    toast.error("Failed to send the message:", error?.response?.data?.message || "Unknown error");
  }
    },
    getMyChatPartners: async () => {
  set({ isUsersLoading: true });
  try {
    const res = await axiosInstance.get("/messages/chats");
    set({ chats: res.data });
  } catch (error) {
    console.error(error);
    toast.error(error?.response?.data?.message || "Failed to fetch chats");
  } finally {
    set({ isUsersLoading: false });
  }
    },
    getAllContacts: async () => {
  set({ isUsersLoading: true });
  try {
    // Fetch contacts along with their last message from backend
    const res = await axiosInstance.get("/messages/contacts");

    // res.data should now be an array of contacts with lastMessage
    set({ allContacts: res.data});
  } catch (error) {
    console.error(error);
    toast.error(error?.response?.data?.message || "Failed to load contacts");
  } finally {
    set({ isUsersLoading: false });
  }
    },
    
}));
