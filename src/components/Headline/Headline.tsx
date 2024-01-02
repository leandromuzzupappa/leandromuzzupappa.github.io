import styles from "./Headline.module.css";
import { HTMLHeadlineTypes } from "@data/types/headlineTypes";

interface HeadlineProps {
  text: string;
  className?: string;
  size?: "small" | "medium" | "large";
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}
export const Headline = ({
  text,
  size = "medium",
  className,
  level = 2,
}: HeadlineProps) => {
  const Tag = `h${level}` as HTMLHeadlineTypes;

  return (
    <Tag className={`${styles.headline} ${className}`} data-size={size}>
      {text}
    </Tag>
  );
};
