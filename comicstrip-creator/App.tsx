import React, { useState, useCallback } from 'react';
import ComicPanel from './components/ComicPanel';
import { generateComicStrip } from './utils/exportUtils';
import { ComicState } from './types';

const App: React.FC = () => {
  const [state, setState] = useState<ComicState>({
    images: [null, null, null, null],
    title: '',
    watermark: '',
    backgroundColor: '#ffffff',
    titleFont: 'Comic Neue',
    borderColor: '#000000',
    borderWidth: 4
  });
  
  const [isExporting, setIsExporting] = useState(false);

  const fonts = [
    { name: 'Comic Neue', value: 'Comic Neue' },
    { name: 'Inter', value: 'Inter' },
    { name: 'Arial', value: 'Arial' },
    { name: 'Courier New', value: 'Courier New' },
    { name: 'Georgia', value: 'Georgia' },
    { name: 'Verdana', value: 'Verdana' },
  ];

  const handleUpload = useCallback((index: number, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setState(prev => {
        const newImages = [...prev.images];
        newImages[index] = result;
        return { ...prev, images: newImages };
      });
    };
    reader.readAsDataURL(file);
  }, []);

  const handleRemove = useCallback((index: number) => {
    setState(prev => {
      const newImages = [...prev.images];
      newImages[index] = null;
      return { ...prev, images: newImages };
    });
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({ ...prev, title: e.target.value }));
  };

  const handleWatermarkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({ ...prev, watermark: e.target.value }));
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({ ...prev, backgroundColor: e.target.value }));
  };

  const handleBorderColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({ ...prev, borderColor: e.target.value }));
  };

  const handleBorderWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val >= 0) {
      setState(prev => ({ ...prev, borderWidth: val }));
    }
  };

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setState(prev => ({ ...prev, titleFont: e.target.value }));
  };

  const handleExport = async () => {
    if (state.images.every(img => img === null)) {
      alert("Please upload at least one image.");
      return;
    }

    setIsExporting(true);
    try {
      const dataUrl = await generateComicStrip(
        state.images, 
        state.title, 
        state.watermark,
        state.backgroundColor,
        state.titleFont,
        state.borderColor,
        state.borderWidth
      );
      
      const link = document.createElement('a');
      link.href = dataUrl;
      const safeTitle = state.title.trim().replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'comic_strip';
      link.download = `${safeTitle}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export comic strip. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col max-w-7xl mx-auto">
      <header className="mb-8 text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-comic font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Comic Strip Creator
        </h1>
        <p className="text-slate-400">Turn your photos into a perfect 1:1 comic square</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <aside className="lg:w-1/3 space-y-6 w-full">
          <div className="bg-slate-800 p-6 rounded-2xl shadow-xl border border-slate-700">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              Comic Details
            </h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-400 mb-1">Title</label>
                <input
                  id="title"
                  type="text"
                  placeholder="The Daily Adventures..."
                  value={state.title}
                  onChange={handleTitleChange}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none placeholder-slate-600"
                  maxLength={40}
                />
              </div>

              <div>
                <label htmlFor="watermark" className="block text-sm font-medium text-slate-400 mb-1">Watermark</label>
                <input
                  id="watermark"
                  type="text"
                  placeholder="@MyHandle"
                  value={state.watermark}
                  onChange={handleWatermarkChange}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none placeholder-slate-600"
                  maxLength={20}
                />
              </div>
            </div>

            <h2 className="text-xl font-bold mt-8 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>
              Appearance
            </h2>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="bgcolor" className="block text-sm font-medium text-slate-400 mb-1">Background Color</label>
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-600 rounded-lg p-1.5">
                    <input
                      id="bgcolor"
                      type="color"
                      value={state.backgroundColor}
                      onChange={handleColorChange}
                      className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent p-0"
                    />
                    <span className="text-sm font-mono text-slate-300 uppercase">{state.backgroundColor}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="bordercolor" className="block text-sm font-medium text-slate-400 mb-1">Border Color</label>
                    <div className="flex items-center gap-2 bg-slate-900 border border-slate-600 rounded-lg p-1.5">
                        <input
                          id="bordercolor"
                          type="color"
                          value={state.borderColor}
                          onChange={handleBorderColorChange}
                          className="w-full h-8 rounded cursor-pointer border-0 bg-transparent p-0"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="borderwidth" className="block text-sm font-medium text-slate-400 mb-1">Border Width</label>
                    <input
                      id="borderwidth"
                      type="number"
                      min="0"
                      max="20"
                      value={state.borderWidth}
                      onChange={handleBorderWidthChange}
                      className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
              </div>

              <div>
                <label htmlFor="font" className="block text-sm font-medium text-slate-400 mb-1">Title Font</label>
                <select
                  id="font"
                  value={state.titleFont}
                  onChange={handleFontChange}
                  className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
                >
                  {fonts.map(font => (
                    <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                      {font.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-700">
              <button
                onClick={handleExport}
                disabled={isExporting}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98]
                  ${isExporting 
                    ? 'bg-slate-600 cursor-wait opacity-80' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white'
                  }`}
              >
                {isExporting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                    <span>Download Square Comic</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </aside>

        <main className="lg:w-2/3 w-full">
          <div className="sticky top-8 space-y-4">
            <div className="flex justify-between items-center text-slate-400 text-sm px-1">
              <span>Live Preview</span>
              <span>1:1 Export Canvas</span>
            </div>
            
            <div 
              className="relative w-full aspect-square rounded-2xl shadow-2xl transition-colors duration-300 overflow-hidden flex flex-col items-center justify-center p-8 md:p-12"
              style={{ backgroundColor: state.backgroundColor }}
            >
              {/* Layout matching Export Logic */}
              <div className="w-full h-full flex flex-col">
                
                {/* Title Preview (Top Margin) */}
                <div className="h-[15%] flex items-center justify-center px-4">
                  {state.title ? (
                    <h2 
                      className="text-3xl md:text-5xl font-bold text-slate-800 break-words text-center"
                      style={{ fontFamily: state.titleFont }}
                    >
                      {state.title}
                    </h2>
                  ) : (
                    <span className="text-slate-300 italic text-xl opacity-50">Untitled Comic</span>
                  )}
                </div>

                {/* Grid (Centered Content) */}
                <div className="flex-grow flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-4 w-full max-w-[85%] aspect-square">
                    {state.images.map((img, index) => (
                      <ComicPanel
                        key={index}
                        index={index}
                        image={img}
                        onUpload={handleUpload}
                        onRemove={handleRemove}
                        borderColor={state.borderColor}
                        borderWidth={state.borderWidth}
                      />
                    ))}
                  </div>
                </div>

                {/* Watermark Preview (Bottom Left) */}
                <div className="h-[10%] flex items-end justify-start p-2 px-4">
                  {state.watermark && (
                    <span className="font-bold text-slate-500 text-lg md:text-xl opacity-70">
                      {state.watermark}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <p className="text-center text-slate-500 text-sm">
              Note: The preview above accurately represents the final square export.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;