export default function Status({ name, bgColor, textColor }: { name: string; bgColor: string; textColor: string }) {
  return (
    <div className="flex items-center  justify-center md:justify-start">
      <div className={bgColor} style={{ width: "8px", height: "8px", borderRadius: "100%", marginRight: "8px" }}></div>
      <span className={`${textColor} hidden md:block`}>{name}</span>
    </div>
  );
}
