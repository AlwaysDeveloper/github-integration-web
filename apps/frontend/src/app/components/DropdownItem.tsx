export function DropdownItem({
  icon,
  label,
  onClick,
  danger = false,
}: {
  icon: string;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] transition-colors text-left
        ${danger
          ? "text-[#FF7B72] hover:bg-[#2D1515]"
          : "text-[#7D8590] hover:bg-white/5 hover:text-white"
        }`}
    >
      <i className={`ti ${icon}`} aria-hidden="true" style={{ fontSize: 15 }} />
      {label}
    </button>
  );
}