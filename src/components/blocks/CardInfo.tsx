import React from 'react';

type Props = {
  title: string;
  value: string;
  icon?: string;
};

const CardInfo: React.FC<Props> = ({ title, value, icon }) => {
  return (
    <div className="flex items-center gap-4 rounded-xl border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-zinc-100 text-xl">
          {icon}
        </div>
      )}
      <div>
        <p className="text-sm font-medium text-zinc-500">{title}</p>
        <p className="text-2xl font-bold text-zinc-900">{value}</p>
      </div>
    </div>
  );
};

export default CardInfo;
