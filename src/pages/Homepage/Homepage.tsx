import { Experience } from "@/components/Experience/Experience";
import { Bento } from "@/components/Bento/Bento";
import { Heading } from "@/components/Heading/Heading";
import { Hero } from "@components/Hero/Hero";
import { Section } from "@layouts/Section/Section";
import { Text } from "@components/Text/Text";
import styles from "./Homepage.module.css";

export const Homepage = () => {
  return (
    <main className={`content-grid ${styles.homepage}`}>
      <Hero />

      <Section classList={styles.experienceSection}>
        <Heading text="Experience." size="medium" />
        <Experience />
      </Section>
      <Section classList={styles.projectsSection}>
        <Heading text="Github Pens." size="medium" />
        <Bento />
      </Section>
      <Section>
        <Heading text="Forward" size="medium" />
        <Heading text="-- Thinking." size="medium" />
        <Text
          text="Graphic Designer and self-taught Programmer weaving creativity and code to shape brands and websites."
        />
        <Text
          text="I express myself through oil painting, mandala and lettering drawings, and from time to time pottery. I'm also coffee and tea enthusiast, so occasionally struggle with burning liquids. When not immersed in design and code, I love exploring Buenos Aires on my bike."
        />
      </Section>

      <span className={styles.version}>mvp 0.1.5</span>
    </main>
  );
};
