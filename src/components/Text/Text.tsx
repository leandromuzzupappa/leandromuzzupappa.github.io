import styles from "./Text.module.css";
interface TextProps {
  text: string;
  weight?: "light" | "regular" | "bold";
  className?: string;
  tag?: "p" | "span";
  align?: "left" | "center" | "right";
}

export const Text = ({
  text,
  className,
  tag = "p",
  weight = "regular",
  align = "left",
}: TextProps) => {
  const Tag = tag;

  const parseText = (text: string) => {
    return text.split("\\n").map((item, i) => {
      return <span key={i}>{item.trim()}</span>;
    });
  };

  return (
    <Tag
      className={`${styles.text} ${className}`}
      data-align={align}
      data-weight={weight}
    >
      {parseText(text)}
    </Tag>
  );
};
