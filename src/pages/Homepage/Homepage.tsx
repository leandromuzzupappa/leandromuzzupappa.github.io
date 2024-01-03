import { Accordion } from "@/components/Accordion/Accordion";
import { Headline } from "@components/Headline/Headline";
import { Hero } from "@components/Hero/Hero";
import { Section } from "@layouts/Section/Section";
import { Text } from "@components/Text/Text";
import styles from "./Homepage.module.css";

export const Homepage = () => {
  return (
    <main className={`content-grid ${styles.homepage}`}>
      <Hero />

      <Section>
        <Headline text="Experience." size="medium" classList={styles.experienceSection} />
        <Accordion />
      </Section>
      <Section>
        <Headline text="Projects." size="medium" />
      </Section>
      <Section>
        <Headline text="Forward" size="medium" />
        <Headline text="-- Thinking." size="medium" />
        <Text
          text="Graphic Designer and self-taught Programmer weaving creativity and code to shape brands and websites."
        />
        <Text
          text="I express myself through oil painting, mandala and lettering drawings, and from time to time pottery. I'm also coffee and tea enthusiast, so occasionally struggle with burning liquids. When not immersed in design and code, I love exploring Buenos Aires on my bike."
        />
      </Section>
    </main>
  );
};
