import styles from "./Heading.module.css";
import { IHeadingProps } from "@data/interfaces/heading";

export const Heading = ({
  align = "left",
  classList = "",
  level = 2,
  size = "medium",
  text,
  weight = "bold",
}: IHeadingProps) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <Tag
      className={`${styles.heading} ${classList}`}
      data-font-weight={weight}
      data-size={size}
      data-align={align}
    >
      {text}
    </Tag>
  );
};
