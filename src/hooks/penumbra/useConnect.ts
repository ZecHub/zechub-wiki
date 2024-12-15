import client from "@/lib/penumbra/client";
import {
  PenumbraClient,
  PenumbraRequestFailure,
  PenumbraState,
} from "@penumbra-zone/client";
import { useEffect, useState } from "react";

export default function useConnect() {
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState<string>();
  const [error, setError] = useState<Error>();

  const reconnect = async () => {
    const providers = PenumbraClient.getProviders();
    const connected = Object.keys(providers).find((k) =>
      PenumbraClient.isProviderConnected(k)
    );

    if (!connected) {
      return;
    }

    try {
      await client.connect(connected);
      setConnected(connected);
    } catch (err: any) {
      console.error(err);
      setError(err);
    }
  };

  const onConnect = async (path: string) => {
    try {
      setLoading(true);
      await client.connect(path);
    } catch (err) {
      console.error("onConnect::error: ", err);

      if (err instanceof Error && err.cause) {
        if (err.cause === PenumbraRequestFailure.Denied) {
          alert(
            "Connection denied: you should delete this website from the list of Connected sites in the extension settings"
          );
        }

        if (err.cause === PenumbraRequestFailure.NeedsLogin) {
          alert("Please login to the extension and try again");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const onDisconnect = async () => {
    if (!client.connected) {
      return;
    }

    try {
      await client.disconnect();
    } catch (err: any) {
      console.error("onDisconnect::error :", err);
      setError(err.message);
    }
  };

  useEffect(() => {
    reconnect();
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
    onConnect,
    onDisconnect,
    error,
  };
}
