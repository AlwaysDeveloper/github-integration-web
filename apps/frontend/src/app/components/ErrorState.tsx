export function ErrorState({ message }: { message: string }) {
  return (
    <div className="min-h-screen bg-[#080C10] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-center">
        <i className="ti ti-alert-circle text-[#FF7B72]" style={{ fontSize: 32 }} aria-hidden="true" />
        <p className="text-[14px] text-[#7D8590]">{message}</p>
      </div>
    </div>
  );
}