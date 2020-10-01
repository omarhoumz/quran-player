import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

import styles from './player.module.css'

const arr = new Array(114).fill(0)

function getAudioName(index) {
  return String(index + 1).padStart(3, '0')
}

const Player = memo(function Player() {
  const [aud, setAud] = useState(0)
  const [soar, setSoar] = useState({})
  const audioRef = useRef()
  const [autoPlay, setAutoPlay] = useState(true)

  useEffect(() => {
    fetch('https://www.mp3quran.net/ar/ajax/soar/list')
      .then((d) => d.json())
      .then((d) => {
        const soar = {}
        d.soar.forEach((e) => {
          soar[e.id] = e.name
        })
        setSoar(soar)
      })
  }, [])

  const handleEnded = useCallback(() => {
    if (!autoPlay || !audioRef.current) return null

    setAud((e) => ++e)
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
    <div>
      <h1>Player</h1>
      <audio
        ref={audioRef}
        style={{ width: '90%' }}
        controls
        autoplay
        src={`https://server8.mp3quran.net/afs/${getAudioName(aud)}.mp3`}
      ></audio>

      <div>
        <button
          className={[styles.button, autoPlay ? styles.active : null]
            .filter(Boolean)
            .join(' ')}
          onClick={() => setAutoPlay((e) => !e)}
        >
          {autoPlay ? 'ON' : 'OFF'}
        </button>
      </div>

      <div className={styles.grid}>
        {arr.map((_, index) => {
          const isActive = index === aud
          return (
            <button
              className={[styles.button, isActive ? styles.active : null]
                .filter(Boolean)
                .join(' ')}
              onClick={isActive ? null : () => setAud(index)}
            >
              <span>{index + 1}</span> - {soar[index + 1]}
            </button>
          )
        })}
      </div>
    </div>
  )
})

export default Player
