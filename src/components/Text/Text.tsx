import styles from "./Text.module.css";
import { ITextProps } from "@data/interfaces/text";


export const Text = ({
  align = "left",
  classList,
  selfRef,
  tag = "p",
  text,
  weight = "regular",
}: ITextProps) => {
  const Tag = tag;

  const parseText = (text: string) => {
    return text.split("\\n").map((item, i) => {
      return <span key={i}>{item.trim()}</span>;
    });
  };

  return (
    <Tag
      ref={selfRef}
      className={`${styles.text} ${classList || ''}`}
      data-align={align}
      data-weight={weight}
    >
      {parseText(text)}
    </Tag>
  );
};
