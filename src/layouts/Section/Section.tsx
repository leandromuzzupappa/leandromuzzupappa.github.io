import styles from "./Section.module.css";

export const Section = ({ children, classList }: { children: React.ReactNode, classList?: string }) => {
  return <section className={`${styles.section} ${classList ?? ''}`}>{children}</section>;
};
