import React from "react";

type ChartHeaderProps = {
  title: string;
  children?: React.ReactNode;
};
export default function ChartHeader(props: ChartHeaderProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap mt-12 mb-6 items-center">
        <h3 className="md:text-lg text-md font-semibold flex-1">{props.title}</h3>
        <>{props.children}</>
      </div>
    </div>
  );
}
