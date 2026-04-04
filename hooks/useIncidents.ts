import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Incident, IncidentFilters, PaginatedResponse } from "@/types";

export const incidentKeys = {
  all:    ["incidents"] as const,
  list:   (f: IncidentFilters) => ["incidents", "list", f] as const,
  detail: (id: string)         => ["incidents", "detail", id] as const,
};

export function useIncidents(filters: IncidentFilters = {}, page = 1) {
  return useQuery({
    queryKey: incidentKeys.list(filters),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Incident>>(
        "/incidents",
        { params: { ...filters, page, per_page: 20 } }
      );
      return data;
    },
  });
}

export function useIncident(id: string) {
  return useQuery({
    queryKey: incidentKeys.detail(id),
    queryFn: async () => {
      const { data } = await api.get<Incident>(`/incidents/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

export function useCreateIncident() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Partial<Incident>) => {
      const { data } = await api.post<Incident>("/incidents", payload);
      return data;
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: incidentKeys.all }),
  });
}

export function useUpdateIncidentStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: string;
    }) => {
      const { data } = await api.patch<Incident>(
        `/incidents/${id}/status`,
        { status }
      );
      return data;
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: incidentKeys.detail(id) });
      qc.invalidateQueries({ queryKey: incidentKeys.all });
    },
  });
}