import {create} from "zustand";
import { axiosInstance } from "@/lib/axios";

export const useRouteStore = create((set, get) => ({
    routes: [],
    setRoutes: (routes)=> set({routes}),
}));