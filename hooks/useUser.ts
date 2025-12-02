import { authClient } from "@/lib/auth-client";
import useSWR from "swr";

const fetchSession = async () => {
  const { data, error } = await authClient.getSession();
  if (error) throw error;
  return data;
};

export const useUser = () => {
  const { data: session, error, isLoading } = useSWR("session", fetchSession);

  return { session, error, isLoading };
};
