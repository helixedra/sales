"use client";
export default function Status({ name, status }: { name: string; status: string }) {
  return (
    <div className="flex items-center justify-center md:justify-start">
      <div style={{ marginRight: "8px" }} className={`status-${status}`}>
        &bull;
      </div>
      <span className={`status-${status} hidden md:block`}>{name}</span>
    </div>
  );
}
