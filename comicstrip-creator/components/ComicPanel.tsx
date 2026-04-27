import React, { useRef } from 'react';
import { PanelProps } from '../types';

const ComicPanel: React.FC<PanelProps> = ({ index, image, onUpload, onRemove, borderColor, borderWidth }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(index, e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        onUpload(index, e.dataTransfer.files[0]);
    }
  };

  return (
    <div 
      className="relative aspect-square w-full rounded-lg bg-slate-800 hover:border-blue-500 transition-all group overflow-hidden box-border"
      style={{
        borderColor: borderColor,
        borderWidth: `${borderWidth}px`,
        borderStyle: image ? 'solid' : 'dashed'
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept="image/png, image/jpeg"
        className="hidden"
        ref={inputRef}
        onChange={handleFileChange}
      />
      
      {image ? (
        <>
          <img 
            src={image} 
            alt={`Panel ${index + 1}`} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <button
              onClick={() => inputRef.current?.click()}
              className="px-3 py-2 bg-blue-600 text-white rounded font-medium text-sm hover:bg-blue-500 border-0"
            >
              Replace
            </button>
            <button
              onClick={() => onRemove(index)}
              className="px-3 py-2 bg-red-600 text-white rounded font-medium text-sm hover:bg-red-500 border-0"
            >
              Remove
            </button>
          </div>
        </>
      ) : (
        <div 
            className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer text-slate-500 hover:text-blue-400"
            onClick={() => inputRef.current?.click()}
        >
          <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="font-semibold">Panel {index + 1}</span>
          <span className="text-xs opacity-70 mt-1">Click or Drop PNG</span>
        </div>
      )}
      
      <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded pointer-events-none border-0">
        {index + 1}
      </div>
    </div>
  );
};

export default ComicPanel;