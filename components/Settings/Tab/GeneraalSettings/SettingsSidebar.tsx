import { IoChevronForwardOutline } from "react-icons/io5";

interface Props {
  activeSection: string;
  setActiveSection: (value: any) => void;
}

export default function SettingsSidebar({
  activeSection,
  setActiveSection,
}: Props) {
  const itemClass = (key: string) =>
    `flex justify-between items-center p-4 rounded-lg cursor-pointer transition
     ${activeSection === key ? "hover:bg-[#12111A]" : "hover:bg-[#12111A]"}`;

  return (
    <div className="bg-[#12111A] md:h-screen rounded-xl py-4 space-y-0">
      
      {/* Currency */}
      <div
        className={itemClass("currency")}
        onClick={() => setActiveSection("currency")}
      >
        <div>
          <p className="font-Manrope">Default Currency Display</p>
          <span className="text-xs font-Manrope text-gray-400">
            Set the primary fiat currency
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-400">
          <span className="font-Manrope">USD</span>
          <IoChevronForwardOutline />
        </div>
      </div>

      {/* Language */}
      <div
        className={itemClass("language")}
        onClick={() => setActiveSection("language")}
      >
        <div>
          <p className="font-Manrope">Default Language</p>
          <span className="text-xs font-Manrope text-gray-400">
            Select system language
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-400">
          <span className="font-Manrope">English</span>
          <IoChevronForwardOutline />
        </div>
      </div>

      {/* Date Time */}
      <div
        className={itemClass("datetime")}
        onClick={() => setActiveSection("datetime")}
      >
        <div>
          <p className="font-Manrope">Date & Time Format</p>
          <span className="text-xs font-Manrope text-gray-400">
            Choose time format
          </span>
        </div>

        <div className="flex items-center gap-2 text-gray-400">
          <span className="font-Manrope">12h</span>
          <IoChevronForwardOutline />
        </div>
      </div>

    </div>
  );
}
