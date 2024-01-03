import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Headline } from '@components/Headline/Headline';
import { Text } from '@components/Text/Text';
import styles from './AccordionItem.module.css';
import { IExperience } from "@/data/interfaces/experience"

export const AccordionItem = ({
  role,
  company,
  dateFrom,
  dateTo,
  place,
  description,
  technologies,
}: IExperience) => {
  const [isOpen, setIsOpen] = useState(false);

  const itemRef = useRef<HTMLLIElement>(null);
  const itemHeadRef = useRef<HTMLDivElement>(null);
  const itemBodyRef = useRef<HTMLUListElement>(null);
  const itemActionRef = useRef<HTMLButtonElement>(null);

  const { contextSafe } = useGSAP({ scope: itemRef });

  function getRefHeight<ElementType>(ref: React.RefObject<ElementType & { offsetHeight: number }>): number {
    return ref.current!.offsetHeight;
  }

  const onToggleAccordion = contextSafe(() => {
    const status = !isOpen
    setIsOpen(status);

    const tl = gsap.timeline({ paused: true });

    const itemHeight = status
      ? getRefHeight(itemRef) + getRefHeight(itemBodyRef)
      : getRefHeight(itemRef) - getRefHeight(itemBodyRef)


    tl.to(itemRef.current, {
      height: itemHeight,
      duration: 0.8,
      ease: 'back.out(1.7)'
    })

    tl.to(itemBodyRef.current, {
      autoAlpha: status ? 1 : 0,
      opacity: status ? 1 : 0,
      yPercent: status ? 0 : -100,
      duration: 0.6,
      ease: 'power3.out'
    }, '<')

    tl.to(itemActionRef.current, {
      rotate: status ? 45 * Math.PI : 0,
      padding: status ? '1rem' : '.8rem 1.5rem',
      scale: status ? 1.5 : 1,
      duration: 0.6,
      ease: 'power3.out'
    }, '<')

    tl.play();
  })

  return (
    <li ref={itemRef} className={styles.item} data-open={isOpen}>
      <div ref={itemHeadRef} className={styles.head}>
        <button onClick={() => onToggleAccordion()}>
          <Headline text={role} level={3} classList={styles.title} />
          <Text text={`@${company}`} classList={styles.title} />
        </button>

        <button ref={itemActionRef} className={styles.action} onClick={() => onToggleAccordion()}>
          <span>+</span>
        </button>
      </div>
      <ul ref={itemBodyRef} className={`${styles.body}`}>
        <li>
          <Text text={`${dateFrom} - ${dateTo} // ${place}`} classList={styles.place} />
        </li>
        <li>
          <Text text={description} classList={styles.description} />
        </li>
        <li>
          <Text text={`Main stack: ${technologies.join(', ')}`} classList={styles.stack} />
        </li>
      </ul>
    </li>
  )
}