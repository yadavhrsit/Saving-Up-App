import React from "react";

function DataCard({ title, icon: Icon, data, color }) {
  const lighterColor = `${color}60`;

  return (
    <div className="bg-white p-4 grid grid-cols-2 rounded-lg">
      <p className="text-zinc-600 capitalize font-medium">{title}</p>
      <div
        style={{ backgroundColor: lighterColor }}
        className="flex items-center justify-center p-2 w-fit rounded-2xl justify-self-end"
      >
        <Icon style={{ color: color }} className="w-8 h-8" />
      </div>
      <p className="text-zinc-950 capitalize font-bold text-4xl">{data}</p>
    </div>
  );
}

export default DataCard;