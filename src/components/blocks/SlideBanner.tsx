import React from 'react';

type Props = {
  title: string;
  description: string;
  imageUrl?: string;
  ctaText?: string;
};

const SlideBanner: React.FC<Props> = ({
  title,
  description,
  imageUrl,
  ctaText,
}) => {
  return (
    <div className="relative flex min-h-[300px] flex-col justify-center overflow-hidden rounded-2xl bg-zinc-900 p-12 text-white">
      {imageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
      )}
      <div className="relative z-10 max-w-lg">
        <h2 className="mb-4 text-4xl font-bold tracking-tight">{title}</h2>
        <p className="mb-8 text-lg leading-relaxed text-zinc-400">
          {description}
        </p>
        {ctaText && (
          <button className="rounded-full bg-white px-6 py-3 font-semibold text-black transition-colors hover:bg-zinc-200">
            {ctaText}
          </button>
        )}
      </div>
    </div>
  );
};

export default SlideBanner;
