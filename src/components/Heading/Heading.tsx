import styles from "./Heading.module.css";
import { IHeadingProps } from "@data/interfaces/heading";

export const Heading = ({
  align = "left",
  classList = "",
  level = 2,
  selfRef,
  size = "medium",
  text,
  weight = "bold",
}: IHeadingProps) => {
  const Tag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  return (
    <Tag
      ref={selfRef}
      className={`${styles.heading} ${classList}`}
      data-font-weight={weight}
      data-size={size}
      data-align={align}
    >
      {text}
    </Tag>
  );
};
