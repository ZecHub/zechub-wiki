
import {
  getAmount,
  getMetadataFromBalancesResponse,
} from "@penumbra-zone/getters/balances-response";
import { ViewService } from "@penumbra-zone/protobuf";
import { AddressView } from "@penumbra-zone/protobuf/penumbra/core/keys/v1/keys_pb";
import { BalancesResponse } from "@penumbra-zone/protobuf/penumbra/view/v1/view_pb";
import { useCallback, useEffect, useState } from "react";
import client  from "./client";


export const fetchAddress = async (
  account: number
): Promise<AddressView | undefined> => {
  const viewService = client.service(ViewService);
  const res = await viewService.addressByIndex({ addressIndex: { account } });
  if (!res?.address) {
    return undefined;
  }
  return new AddressView({
    addressView: {
      case: "decoded",
      value: res,
    },
  });
};
