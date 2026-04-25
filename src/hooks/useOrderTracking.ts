"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getOrderTracking } from "@/services/order.service";

type TStreamState = "connecting" | "connected" | "disconnected";

export const useOrderTracking = (orderId: string) => {
  const queryClient = useQueryClient();
  const [streamState, setStreamState] = useState<TStreamState>("connecting");
  const [liveMessage, setLiveMessage] = useState("");

  const queryKey = useMemo(() => ["order-tracking", orderId], [orderId]);

  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await getOrderTracking(orderId);
      return res.data;
    },
    enabled: !!orderId,
    staleTime: 1000 * 10,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (!orderId) return;

    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    const eventSource = new EventSource(
      `${baseUrl}/orders/${orderId}/tracking/stream`,
      { withCredentials: true }
    );

    setStreamState("connecting");

    eventSource.onopen = () => {
      setStreamState("connected");
    };

    eventSource.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);

        if (payload?.type === "ORDER_UPDATED") {
          setLiveMessage(payload.message || "");
          queryClient.invalidateQueries({ queryKey });
        }
      } catch {}
    };

    eventSource.onerror = () => {
      setStreamState("disconnected");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [orderId, queryClient, queryKey]);

  return {
    ...query,
    streamState,
    liveMessage,
  };
};