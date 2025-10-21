import Button from "@/components/Button/Button";

interface ExportButtonProps {
  handleSaveToPng: (imgLabel: string) => void;
  imgLabel: string;
}
export function ExportButton(props: ExportButtonProps) {
  return (
    <div className="flex justify-between items-center text-sm text-gray-500">
      <Button
        text="Export PNG"
        className="bg-[#1984c7] text-white px-4 py-2 rounded-md  hover:bg-[#1675b1] transition"
        onClick={() => props.handleSaveToPng(props.imgLabel)}
      />
    </div>
  );
}
