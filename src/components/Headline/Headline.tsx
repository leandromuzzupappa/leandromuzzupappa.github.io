import styles from "./Headline.module.css";
import { HTMLHeadlineTypes } from "@data/types/headlineTypes";

interface HeadlineProps {
  text: string;
  className?: string;
  size?: "small" | "medium" | "large";
  tag?: HTMLHeadlineTypes;
}
export const Headline = ({
  text,
  size = "medium",
  className,
  tag = "h2",
}: HeadlineProps) => {
  const Tag = tag;
  return (
    <Tag className={`${styles.headline} ${className}`} data-size={size}>
      {text}
    </Tag>
  );
};
