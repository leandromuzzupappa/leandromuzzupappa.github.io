import { Headline } from "@components/Headline/Headline";
import { Text } from "@components/Text/Text";
import styles from "./Hero.module.css";

export const Hero = () => {
  return (
    <section className={`full-width ${styles.hero}`}>
      <Headline
        text="Leandro Muzzupappa"
        classList={styles.headline}
        size="large"
      />
      <Text
        text="Frontend Developer and UI Designer \n Empowered by technology \n curious by nature."
        classList={styles.copy}
        align="right"
      />
    </section>
  );
};
