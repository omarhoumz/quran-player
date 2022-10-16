import Link from 'next/link'
import useSWR from 'swr'

import fetcher from 'src/utils/fetcher'

export default function Reciters() {
  const { data } = useSWR('https://mp3quran.net/api/v3/reciters', fetcher)

  if (!data) return <div>جار التحميل ...</div>

  return (
    <div className='flex flex-col py-8 gap-2'>
      {data.reciters.map(({ name, id }) => {
        return (
          <Link href={`/player/${id}/0`}>
            <a>
              {id} - {name}
            </a>
          </Link>
        )
      })}
    </div>
  )
}
