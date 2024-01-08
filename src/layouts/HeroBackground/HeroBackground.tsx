import styles from './HeroBackground.module.css'

export interface IHeroBackground {
  classList?: string;
  children?: React.ReactNode;
  selfRef?: React.RefObject<HTMLDivElement>;
}

export const HeroBackground = ({
  classList = '',
  children,
  selfRef
}: IHeroBackground) => {
  return <>
    <div ref={selfRef} className={`${styles.heroBackground} ${classList}`}>
      {children ? children : <></>}
    </div>
  </>
}