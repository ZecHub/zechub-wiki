
interface ToolsProps {
  onToolChange: (selectedTool: string) => void; // Callback function to pass the selected tool up
}

export const Tools: React.FC<ToolsProps> = ({ onToolChange }) => {
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onToolChange(event.target.value); // Call the callback with the selected value
  };

  return (
    <div className="flex justify-end gap-2 text-right my-4 text-sm text-gray-500">
      <span className="px-3 py-2">Tools:</span>
      <span>
        <select onChange={handleSelectChange} className="outline-none focus:outline-none focus:border-slate-300 active:border-slate-300 border-solid border-slate-300">
          <option value="" disabled>
            Select
          </option>
          <option value="supply">Shielded Supply Chart</option>
          <option value="transaction">Shielded Transactions Chart</option>
        </select>
      </span>
    </div>
  );
};
