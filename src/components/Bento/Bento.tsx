import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from "@gsap/react";
import { Text } from '../Text/Text';
import styles from './Bento.module.css';
import { getProjects } from '@/services/projects';
import { IGitHub } from '@/data/interfaces/github';

export const Bento = () => {
  const bentoRef = useRef<HTMLUListElement>(null);
  const loadMoreRef = useRef<HTMLLIElement>(null);

  const [config, setConfig] = useState({
    sort: 'pushed',
    per_page: 5,
    page: 1
  });
  const [data, setData] = useState<IGitHub[]>([]);
  const [mockItemsPosition, setMockItemsPositions] = useState<number[]>([]);
  const [showLoadMore, setShowLoadMore] = useState<boolean>(true);

  const { contextSafe } = useGSAP({ scope: bentoRef });

  useEffect(() => {
    getProjects().then(data => setData(data));

  }, [])

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

    const currentPosition = Number(loadMoreEl.dataset.bento);
    setMockItemsPositions([...mockItemsPosition, currentPosition]);

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
          duration: 0.5,
          ease: 'power2.inOut'
        })

      }
    })
  });

  const renderLoadMore = () => {
    return <li ref={loadMoreRef} data-bento={0}>
      {showLoadMore ? <button onClick={() => onLoadMore()}>
        <Text text="Load more" />
      </button> : <a href="https://github.com/leandromuzzupappa">
        <Text text="Go to Github" /></a>}
    </li>
  }

  const renderMockItems = () => {
    return mockItemsPosition.map((position) => (
      <li key={'mock-' + position} data-bento={position}></li>
    ))
  }

  return (
    <div>
      <ul ref={bentoRef} className={styles.bento}>
        {data.map((repo, i) => (
          <li key={repo.id} data-bento={i + 1} >
            <a href={repo?.html_url} target="_blank" rel="noreferrer">
              <Text text={repo.name} />
            </a>
          </li>
        ))}
        {renderMockItems()}
        {renderLoadMore()}
      </ul>
    </div>
  )
}