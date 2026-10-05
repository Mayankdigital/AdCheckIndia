import { createContext, useContext, useState, useEffect } from 'react';

const FileStoreContext = createContext();

export function FileStoreProvider({ children }) {
  const [files, setFilesState] = useState({ video: null, photo: null });

  // Cleanup object URLs when files change or on unmount
  useEffect(() => {
    return () => {
      if (files.video && files.video.previewUrl) URL.revokeObjectURL(files.video.previewUrl);
      if (files.photo && files.photo.previewUrl) URL.revokeObjectURL(files.photo.previewUrl);
    };
  }, [files]);

  const setFiles = (newFiles) => {
    setFilesState(prev => {
      if (prev.video?.previewUrl) URL.revokeObjectURL(prev.video.previewUrl);
      if (prev.photo?.previewUrl) URL.revokeObjectURL(prev.photo.previewUrl);
      return newFiles;
    });
  };

  const clearFiles = () => {
    setFiles({});
  };

  return (
    <FileStoreContext.Provider value={{ files, setFiles, clearFiles }}>
      {children}
    </FileStoreContext.Provider>
  );
}

export const useFileStore = () => useContext(FileStoreContext);
