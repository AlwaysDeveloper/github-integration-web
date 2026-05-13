export function MetaRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5 text-[13px]">
      <i className={`ti ${icon} text-[#3D444D]`} style={{ fontSize: 15 }} aria-hidden="true" />
      <span className="text-[#7D8590] w-28 shrink-0">{label}</span>
      <span className="text-[#E6EDF3]">{value}</span>
    </div>
  );
}