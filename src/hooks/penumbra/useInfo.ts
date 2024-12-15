import { fetchAddress, fetchBalances } from "@/lib/penumbra/fetchers";
import { AddressView } from "@penumbra-zone/protobuf/penumbra/core/keys/v1/keys_pb";
import { BalancesResponse } from "@penumbra-zone/protobuf/penumbra/view/v1/view_pb";
import { useCallback, useEffect, useState } from "react";

export default function useInfo(connectedWallet?: string) {
  const [address, setAddress] = useState<AddressView>();
  const [balances, setBalances] = useState<BalancesResponse[]>([]);

  const fetchInfo = useCallback(async () => {
    if (!connectedWallet) {
      setAddress(undefined);
      setBalances([]);
    } else {
      setAddress(await fetchAddress(0));
      setBalances(await fetchBalances(0));
    }
  }, [connectedWallet, setAddress]);

  useEffect(() => {
    fetchInfo();
  }, [connectedWallet, fetchInfo]);

  return { address, balances };
}
