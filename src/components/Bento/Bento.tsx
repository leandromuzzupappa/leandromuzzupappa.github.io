import { useEffect, useState } from 'react'
import { Text } from '../Text/Text'
import styles from './Bento.module.css'
import { getProjects } from '@/services/projects'
import { IGitHub } from '@/data/interfaces/github'

export const Bento = () => {
  const [config, setConfig] = useState({
    sort: 'pushed',
    per_page: 5,
    page: 1
  })
  const [data, setData] = useState<IGitHub[]>([])

  useEffect(() => {
    getProjects().then(data => setData(data))

  }, [])

  const onLoadMore = async () => {
    const page = config.page + 1;
    const projects = await getProjects({ page })

    setData([...data, ...projects])
    setConfig({ ...config, page })
  }

  return (
    <div>
      <ul className={styles.bento}>
        {data.map((repo, i) => (
          <li key={repo.id} data-bento={i + 1} >
            <a href={repo?.html_url} target="_blank" rel="noreferrer">
              <Text text={repo.name} />
            </a>
          </li>
        ))}
        <li data-bento={0}>
          <button onClick={() => onLoadMore()}>
            <Text text="Load more" />
          </button>
        </li>
      </ul>
    </div>
  )
}