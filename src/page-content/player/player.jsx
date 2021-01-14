import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import useSWR from 'swr'

import styles from './player.module.css'

const arr = new Array(114).fill(0)

const fetcher = (...args) => fetch(...args).then((res) => res.json())

function getAudioName(index) {
  return String(index + 1).padStart(3, '0')
}

const Player = memo(function Player() {
  const { data: soar2, error } = useSWR(
    'https://www.mp3quran.net/ar/ajax/soar/list',
    fetcher,
  )

  const [activeSorah, setActiveSorah] = useState(1)
  const [soar, setSoar] = useState({})
  const audioRef = useRef()
  const [autoPlay, setAutoPlay] = useState(true)

  const handleEnded = useCallback(() => {
    if (!autoPlay || !audioRef.current) return null

    setActiveSorah((e) => ++e)
    audioRef.current.play()
  }, [autoPlay, audioRef])

  useEffect(() => {
    if (!audioRef) return null

    audioRef.current.addEventListener('ended', handleEnded)

    return () => {
      audioRef.current.removeEventListener('ended', handleEnded)
    }
  }, [audioRef, handleEnded])

  return (
    <div className={styles.wrapper}>
      <h1 style={{ textAlign: 'center' }}>Player</h1>
      <audio
        ref={audioRef}
        style={{ width: '90%' }}
        controls
        autoPlay
        src={`https://server8.mp3quran.net/afs/${getAudioName(
          activeSorah,
        )}.mp3`}
      ></audio>

      <div>
        <span style={{ marginInlineEnd: '1rem' }}>تشغيل تلقائي</span>
        <button
          className={[styles.button, autoPlay ? styles.active : null]
            .filter(Boolean)
            .join(' ')}
          onClick={() => setAutoPlay((e) => !e)}
        >
          {autoPlay ? 'غير مشغل' : 'مشغل'}
        </button>
      </div>

      <div className={styles.grid}>
        {!soar2
          ? null
          : soar2.soar.map(({ id, name }, index) => {
              const isActive = id === activeSorah
              return (
                <button
                  key={id}
                  className={[styles.button, isActive && styles.active]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => setActiveSorah(id)}
                  disabled={isActive}
                >
                  <span>{id}</span> - {name}
                </button>
              )
            })}
      </div>
    </div>
  )
})

export default Player
