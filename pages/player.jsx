import Head from 'next/head'
import React, { memo } from 'react'

import Player from 'src/page-content/player/player'

function PlayerPage(props) {
  return (
    <div>
      <Head>
        <title>Quran Player</title>
        <link
          href='https://fonts.googleapis.com/css2?family=Tajawal&display=swap'
          rel='stylesheet'
        ></link>
      </Head>

      <Player />
    </div>
  )
}

export default PlayerPage
