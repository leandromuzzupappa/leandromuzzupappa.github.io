import styles from "./Section.module.css";

export const Section = ({ children }: { children: React.ReactNode }) => {
  return <section className={styles.section}>{children}</section>;
};
