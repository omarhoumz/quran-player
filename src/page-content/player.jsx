import Link from 'next/link'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useRef, useState } from 'react'
import useSWR from 'swr'

import Button from 'src/ui/button'
import fetcher from 'src/utils/fetcher'

function getAudioName(id) {
  return String(id).padStart(3, '0')
}

export default function Player() {
  const router = useRouter()
  const { id, moshafId } = router.query

  const { data: reciterResult } = useSWR(
    !id ? null : 'https://www.mp3quran.net/api/v3/reciters?reciter=' + id,
    fetcher,
    {
      onSuccess: (data) => {
        setMoshafList(data.reciters[0]?.moshaf)
      },
      onError: (error) => {
        console.log(error)
      },
    },
  )

  const { data: soar } = useSWR(
    'https://www.mp3quran.net/ar/ajax/soar/list',
    fetcher,
  )

  const [moshafList, setMoshafList] = useState(
    'https://server8.mp3quran.net/afs/',
  )
  const [activeSorah, setActiveSorah] = useState({ id: 1, name: 'الفاتحة' })
  const [autoPlay, setAutoPlay] = useState(true)
  const audioRef = useRef()

  const handleEnded = useCallback(() => {
    if (!autoPlay || !audioRef.current) return null

    setActiveSorah((sorah) => {
      return soar?.soar[Number(sorah?.id)]
    })

    audioRef.current.play()
  }, [autoPlay, audioRef])

  useEffect(() => {
    if (!audioRef) return null

    audioRef.current.addEventListener('ended', handleEnded)

    return () => {
      if (!audioRef || !audioRef.current) return null

      audioRef.current.removeEventListener('ended', handleEnded)
    }
  }, [audioRef, handleEnded])

  const audioId = getAudioName(activeSorah?.id)

  const moshaf = moshafList[moshafId]

  return (
    <div className='flex'>
      <div className='w-96 py-24 px-8 bg-slate-100'>
        <div className='flex flex-col gap-4 sticky top-4'>
          <h1 className='text-2xl'>{reciterResult?.reciters[0]?.name}</h1>

          <ul>
            {reciterResult?.reciters[0].moshaf.map(({ name }, index) => {
              return (
                <li key={id}>
                  <Link href={{ query: { id, moshafId: index } }}>
                    <a>
                      {String(index) === moshafId ? '> ' : ''}
                      {name}
                    </a>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
      <div className='mx-auto max-w-2xl flex-grow py-24'>
        <h1 className='text-center text-2xl mb-6'>سورة {activeSorah?.name}</h1>

        <audio
          ref={audioRef}
          style={{ width: '90%' }}
          controls
          autoPlay
          src={`${moshaf?.server}${audioId}.mp3`}
          className='sticky top-4 mx-auto'
        />

        <div className='my-4 flex gap-x-4'>
          <span>تشغيل تلقائي</span>

          <Button
            size='sm'
            outline={!autoPlay}
            onClick={() => setAutoPlay((e) => !e)}
          >
            {autoPlay ? 'مشغل' : 'غير مشغل'}
          </Button>
        </div>

        <div className='grid grid-cols-[repeat(auto-fit,minmax(130px,auto))] gap-4 mt-4'>
          {!moshaf?.surah_list
            ? null
            : moshaf?.surah_list.split(',').map((sorahId) => {
                const sorah = soar?.soar[sorahId - 1]

                const { id, name } = sorah ?? {}
                const isActive = id === activeSorah?.id

                return (
                  <Button
                    key={id}
                    outline={!isActive}
                    onClick={() => setActiveSorah(sorah)}
                    // disabled={isActive}
                  >
                    <span>{id}</span> - {name}
                  </Button>
                )
              })}
        </div>
      </div>
    </div>
  )
}
