import React from "react";

type ChartHeaderProps = {
  title: string;
  children?: React.ReactNode;
};
export default function ChartHeader(props: ChartHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="flex mt-12 mb-6 items-center">
        <h3 className="text-lg font-semibold flex-1">{props.title}</h3>
        <>{props.children}</>
      </div>
    </div>
  );
}
