import { PenumbraClient, PenumbraManifest } from "@penumbra-zone/client";
import { useEffect, useState } from "react";

export const useWalletManifests = () => {
  const [manifest, setManifest] = useState<Record<string, PenumbraManifest>>(
    {}
  );
  const [loading, setLoading] = useState(true);

  const loadManifests = async () => {
    setLoading(true);

    const res = PenumbraClient.getProviderManifests();

    const resManifests = await Promise.all(
      Object.entries(res).map(async ([key, promise]) => {
        return [key, await promise];
      })
    );

    setManifest(Object.fromEntries(resManifests));
    setLoading(false);
  };

  useEffect(() => {
    loadManifests();
  }, []);

  return { manifest, loading };
};
