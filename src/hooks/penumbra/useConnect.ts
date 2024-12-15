import client from "@/lib/penumbra/client";
import { PenumbraState } from "@penumbra-zone/client";
import { useEffect, useState } from "react";

export default async function useConnect(origin: string) {
  console.log("onConnect::origin ", origin);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState<string>();
  const [error, setError] = useState<Error>();

  useEffect(() => {
    client.onConnectionStateChange((e) => {
      if (e.state === PenumbraState.Connected) {
        setConnected(e.origin);
      } else {
        setConnected(undefined);
      }
    });
  }, []);

  return {
    loading,
    connected,
  };
}
