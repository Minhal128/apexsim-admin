import { IoIosArrowForward } from "react-icons/io";

interface Props {
  onSelect: (value: string) => void;
}

export default function SettingsList({ onSelect }: Props) {
  const Item = ({
    title,
    desc,
    value,
    onClick,
  }: {
    title: string;
    desc: string;
    value?: string;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className="w-full flex justify-between cursor-pointer items-center py-4 border-b border-white/10"
    >
      <div className="text-left">
        <p className="text-sm font-Manrope">{title}</p>
        <p className="text-xs text-gray-400 font-Manrope">{desc}</p>
      </div>
      <div className="flex items-center font-Manrope gap-2 text-gray-400 text-sm">
        {value}
        <span className="text-lg">
          <IoIosArrowForward />
        </span>
      </div>
    </button>
  );

  return (
    <>
      <h1 className="text-sm font-Manrope mb-2">Network settings</h1>

      <Item
        title="RPC Provider"
        desc="Communication with the blockchain network."
        value="Infura"
        onClick={() => onSelect("rpc")}
      />

      <Item
        title="Transaction confirmation speed"
        desc="Communication with the blockchain network."
        value="Fast"
        onClick={() => onSelect("speed")}
      />

      <Item
        title="Network Health Indicators"
        desc="indicator showing the health of the selected network."
        onClick={() => onSelect("health")}
      />

      <Item
        title="Network latency"
        desc="Response time of the current network"
        value="250ms"
        onClick={() => onSelect("latency")}
      />

      <Item
        title="Network status"
        desc="Response time of the current network"
        value="Online"
        onClick={() => onSelect("status")}
      />

      <Item
        title="Wallet support"
        desc="List of supported wallet"
        onClick={() => onSelect("wallet")}
      />

      <button className="mt-6 w-full cursor-pointer rounded-xl bg-blue-600 py-3 font-medium">
        Save
      </button>
    </>
  );
}
