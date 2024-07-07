export const Tools = () => {
  return (
    <div className="flex justify-end gap-2 text-right my-4 text-sm text-gray-500">
      <span className="px-3 py-2">Tools:</span>
      <span>
        <select className="outline-none focus:outline-none focus:border-slate-300 active:border-slate-300 border-solid border-slate-300">
          <option value="" disabled>
            Select
          </option>
          <option value="#">#</option>
        </select>
      </span>
    </div>
  );
};
