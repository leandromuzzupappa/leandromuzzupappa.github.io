import { FontAlign, FontWeight } from "@data/types/Font";

export interface ITextProps {
  text: string;
  tag?: "p" | "span";
  align?: FontAlign;
  weight?: FontWeight;
  classList?: string;
  selfRef?: React.RefObject<HTMLParagraphElement & HTMLSpanElement>;
}
