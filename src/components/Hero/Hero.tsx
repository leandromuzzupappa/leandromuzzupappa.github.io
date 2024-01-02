import { Headline } from "@components/Headline/Headline";
import { Text } from "@components/Text/Text";
import styles from "./Hero.module.css";

export const Hero = () => {
  return (
    <section className={`full-width ${styles.hero}`}>
      <Headline
        text="Leandro Muzzupappa"
        className={styles.headline}
        size="large"
      />
      <Text
        text="Frontend Developer and UI Designer \n Empowered by technology \n curious by nature."
        className={styles.copy}
        align="right"
      />
    </section>
  );
};
