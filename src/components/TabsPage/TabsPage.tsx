// app/page.tsx or pages/index.tsx in Next.js
"use client";
import { useState, ReactNode } from "react";

interface TabsPageProps {
  titles: [string, string, string];
  components: [ReactNode, ReactNode, ReactNode];
}

export default function TabsPage({ titles, components }: TabsPageProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex justify-center px-0 md:p-6">
      <div className="rounded-xl shadow-md w-full">
        <div className="flex mb-4 max-w-md p-4">
          {titles.map((title, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`flex-1 py-2 text-center ${
                activeIndex === index
                  ? "border-b-2 border-blue-500 font-semibold text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {title}
            </button>
          ))}
        </div>

        <div>{components[activeIndex]}</div>
      </div>
    </div>
  );
}
