import Head from 'next/head'

import Player from 'src/page-content/player'

function PlayerPage() {
  return (
    <div>
      <Head>
        <title>Quran Player</title>
      </Head>

      <Player />
    </div>
  )
}

export default PlayerPage
