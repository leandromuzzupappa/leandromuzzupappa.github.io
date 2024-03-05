import { AccordionItem } from "../AccordionItem/AccordionItem";
import styles from './Experience.module.css';
import { experienceData } from '@/data/experienceData';


export const Experience = () => {
  return (
    <div className={styles.experience}>
      <ul>
        {experienceData.map((experience, index) => {
          return <AccordionItem key={experience.company + index} {...experience} />
        })}
      </ul>
    </div>
  )

};