"use client";

import { useState } from "react";
import SettingsList from "./NetworkSettings/SettingsList";
import RPCProvider from "./NetworkSettings/RPCProvider";
import TransactionSpeed from "./NetworkSettings/TransactionSpeed";
import NetworkHealth from "./NetworkSettings/NetworkHealth";
import NetworkLatency from "./NetworkSettings/NetworkLatency";
import NetworkStatus from "./NetworkSettings/NetworkStatus";
import WalletSupport from "./NetworkSettings/WalletSupport";

export default function NetworkSettings() {
  const [active, setActive] = useState<string>("list");

  const goBack = () => setActive("list");

  return (
    <div className="w-full flex justify-center">
      <div className="w-full text-white">
        {active === "list" && <SettingsList onSelect={setActive} />}
        {active === "rpc" && <RPCProvider onBack={goBack} />}
        {active === "speed" && <TransactionSpeed onBack={goBack} />}
        {active === "health" && <NetworkHealth onBack={goBack} />}
        {active === "latency" && <NetworkLatency onBack={goBack} />}
        {active === "status" && <NetworkStatus onBack={goBack} />}
        {active === "wallet" && <WalletSupport onBack={goBack} />}
      </div>
    </div>
  );
}
