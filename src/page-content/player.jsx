import { useCallback, useEffect, useRef, useState } from 'react'
import useSWR from 'swr'

import Button from 'src/ui/button'

const fetcher = (...args) => fetch(...args).then((res) => res.json())

function getAudioName(index) {
  return String(index + 1).padStart(3, '0')
}

export default function Player() {
  const { data: soar } = useSWR(
    'https://www.mp3quran.net/ar/ajax/soar/list',
    fetcher,
  )

  const [activeSorah, setActiveSorah] = useState({ id: 1, name: 'الفاتحة' })
  const [autoPlay, setAutoPlay] = useState(true)
  const audioRef = useRef()

  const handleEnded = useCallback(() => {
    if (!autoPlay || !audioRef.current) return null

    setActiveSorah((e) => ++e)
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

  return (
    <div className='mx-auto my-24 max-w-2xl'>
      <h1 className='text-center text-2xl mb-6'>{activeSorah?.name}</h1>

      <audio
        ref={audioRef}
        style={{ width: '90%' }}
        controls
        autoPlay
        src={`https://server8.mp3quran.net/afs/${audioId}.mp3`}
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
        {!soar
          ? null
          : soar.soar.map((sorah) => {
              const { id, name } = sorah
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
  )
}
