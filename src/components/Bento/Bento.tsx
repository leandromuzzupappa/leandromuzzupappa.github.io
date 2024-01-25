import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from "@gsap/react";
import { Text } from '../Text/Text';
import styles from './Bento.module.css';
import { getProjects } from '@/services/projects';
import { IGitHub } from '@/data/interfaces/github';

const colors = [
  "#f43f5e",
  "#ec4899",
  "#d946ef",
  "#a855f7",
  "#8b5cf6",
  "#6366f1",
  "#3b82f6",
  "#0ea5e9",
  "#06b6d4",
  "#14b8a6",
  "#10b981",
  "#22c55e",
  "#84cc16",
  "#eab308",
  "#f59e0b",
  "#f97316",
  "#ef4444",
  "#78716c",
  "#737373",
  "#71717a",
  "#6b7280",
  "#64748b",
]

export const Bento = () => {
  const bentoRef = useRef<HTMLUListElement>(null);
  const loadMoreRef = useRef<HTMLLIElement>(null);

  const [config, setConfig] = useState({
    sort: 'pushed',
    per_page: 5,
    page: 1
  });
  const [data, setData] = useState<IGitHub[]>([]);
  const [showLoadMore, setShowLoadMore] = useState<boolean>(true);

  const { contextSafe } = useGSAP({ scope: bentoRef });

  useEffect(() => {
    getProjects().then(data => setData(data));
  }, [])

  useGSAP(() => {
    gsap.to('[data-bento]', {
      opacity: 1,
      duration: 0.3,
      ease: 'power3.inOut',
      stagger: {
        amount: 1.2
      }
    })

    const bentoEl = bentoRef.current;
    if (!bentoEl) return;

    const children = Array.from(bentoEl.children) as HTMLLIElement[];
    const onMouseLeave = () => {
      gsap.to("[data-bento] a", {
        x: 0,
        y: 0,
        duration: 0.3,
      });
    }

    const onMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLLIElement;

      const { x, y } = target.getBoundingClientRect();
      const { clientX, clientY } = e;

      const xMove = (clientX - x) / 20;
      const yMove = (clientY - y) / 20;

      gsap.to(`[data-bento="${target.dataset.bento}"] a`, {
        x: xMove,
        y: yMove,
        duration: 0.3,
      })
    }

    children.forEach((child: HTMLLIElement) => {
      child.addEventListener('mouseleave', onMouseLeave);
      child.addEventListener('mousemove', onMouseMove);
    })
  }, [data])


  const onLoadMore = contextSafe(() => {
    const bentoEl = bentoRef.current;
    const loadMoreEl = loadMoreRef.current;

    if (!bentoEl || !loadMoreEl) return;
    if (config.page > 3) return;

    const page = config.page + 1;

    const loadMore = async () => {
      const projects = await getProjects({ page });

      setData([...data, ...projects]);
      setConfig({ ...config, page });
    };

    loadMore();


    bentoEl.style.setProperty('--grid-rows', `${3 * page}`);

    gsap.to(bentoEl, {
      '--bento-rows': `${3 * page}`,
      /* height: `${60 * page}vh`, */
      duration: 0.5,
      ease: 'power2.inOut'
    })

    gsap.to(loadMoreEl, {
      x: 100,
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut',
      onComplete: () => {
        if (config.page === 3) setShowLoadMore(false);

        loadMoreEl.dataset.bento = `${5 * page + 1}`
        gsap.to(loadMoreEl, {
          x: 0,
          opacity: 1,
          duration: 1.8,
          ease: 'power2.inOut'
        })

      }
    })
  });

  const renderLoadMore = () => {
    return (
      <li
        ref={loadMoreRef}
        data-bento={0}
        style={{ "--bento-bg": colors[gsap.utils.random(0, colors.length - 1, 1)] } as React.CSSProperties}
      >
        {showLoadMore ? <button className={styles.loadMoreBtn} onClick={() => onLoadMore()}>
          <Text text="Load more" />
        </button> : <a href="https://github.com/leandromuzzupappa" target='_blank'>
          <Text text="Go to Github" /></a>}
      </li>
    )
  }

  return (
    <div>
      <ul ref={bentoRef} className={styles.bento}>
        {data.map((repo, i) => (
          <li
            key={repo.id}
            data-bento={i + 1}
            data-bento-radius={gsap.utils.random(0, 3, 1)}
            style={{ "--bento-bg": colors[gsap.utils.random(0, colors.length - 1, 1)] } as React.CSSProperties}
          >
            <a href={repo?.html_url} target="_blank" rel="noreferrer">
              <Text text={repo.name} classList={styles.text} />
            </a>
          </li>
        ))}
        {renderLoadMore()}
      </ul>
    </div>
  )
}