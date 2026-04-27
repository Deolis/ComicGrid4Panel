export interface ComicState {
  images: (string | null)[];
  title: string;
  watermark: string;
  backgroundColor: string;
  titleFont: string;
  borderColor: string;
  borderWidth: number;
}

export interface PanelProps {
  index: number;
  image: string | null;
  onUpload: (index: number, file: File) => void;
  onRemove: (index: number) => void;
  borderColor: string;
  borderWidth: number;
}