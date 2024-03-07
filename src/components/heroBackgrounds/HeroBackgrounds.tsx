import { useLayoutEffect, useMemo, useState } from "react"
import { ConicGradient } from "./ConicGradient/ConicGradient"
import { TheThing } from "./TheThing/TheThing"
import { TBDName } from "./TBDName/TBDName"
import { MeltGradient } from "./MeltGradient/MeltGradient"
import styles from './HeroBackgrounds.module.css'

export const HeroBackgrounds = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [backgroundIndex, setBackgroundIndex] = useState(0);

  const heroBackgrounds = useMemo(() => [
    ConicGradient,
    TheThing,
    TBDName,
    MeltGradient,
  ], []);


  useLayoutEffect(() => {
    if (isMounted) {
      const randomBackground = Math.floor(Math.random() * heroBackgrounds.length)
      setBackgroundIndex(randomBackground)
      return;
    }

    setIsMounted(true);
  }, [isMounted, heroBackgrounds])

  const onChangeBackground = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const index = parseInt(event.target.value);
    setBackgroundIndex(index);
  }

  const Component = heroBackgrounds[backgroundIndex];

  return (
    <>
      <div className={styles.bgSelector}>
        <select onChange={onChangeBackground}>
          {heroBackgrounds.map((Component, index) => (
            <option
              key={index}
              value={index}
              selected={index === backgroundIndex}
            >
              {Component.name}
            </option>
          ))}
        </select>
      </div>
      <Component />
    </>
  )
}