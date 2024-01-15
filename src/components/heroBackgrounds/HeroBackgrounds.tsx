import { useLayoutEffect, useMemo, useState } from "react"
import { ConicGradient } from "./ConicGradient/ConicGradient"
import { TheThing } from "./TheThing/TheThing"

export const HeroBackgrounds = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [backgroundIndex, setBackgroundIndex] = useState(0);

  const heroBackgrounds = useMemo(() => [
    ConicGradient,
    TheThing
  ], []);


  useLayoutEffect(() => {
    if (isMounted) {
      const randomBackground = Math.floor(Math.random() * heroBackgrounds.length)
      setBackgroundIndex(randomBackground)
      return;
    }

    setIsMounted(true);
  }, [isMounted, heroBackgrounds])

  const Component = heroBackgrounds[backgroundIndex];

  return (
    <Component />
  )
}