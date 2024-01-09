import { FontWeight, FontAlign, FontSize } from "@data/types/Font";

export interface IHeadingProps {
  text: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  weight?: FontWeight;
  align?: FontAlign;
  size?: FontSize;
  classList?: string;
  selfRef?: React.RefObject<HTMLHeadingElement>
}
