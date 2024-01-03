import { AccordionItem } from "../AccordionItem/AccordionItem";
import styles from './Accordion.module.css';
import { experienceData } from '@/data/experienceData';


export const Accordion = () => {
  return (
    <div className={styles.accordion}>
      <ul>
        {experienceData.map((experience, index) => {
          return <AccordionItem key={experience.company + index} {...experience} />
        })}
      </ul>
    </div>
  )

};