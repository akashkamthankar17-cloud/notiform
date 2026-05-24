import { useQuery } from "@tanstack/react-query";

// Hook to get the caller's role from the backend
// Placeholder hook — backend has no role methods in this build
export function useCallerRole() {
  return useQuery<string>({
    queryKey: ["callerRole"],
    queryFn: async () => "guest",
    staleTime: 5 * 60 * 1000,
  });
}

// Hook to check if caller is admin
// Placeholder hook — backend has no role methods in this build
export function useIsAdmin() {
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => false,
    staleTime: 5 * 60 * 1000,
  });
}

// Hook to assign a role to a user (admin only)
// Placeholder hook — backend has no role methods in this build
export function useAssignRole() {
  return { mutate: () => {}, isPending: false };
}
