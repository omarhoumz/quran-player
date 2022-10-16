import Head from 'next/head'
import Link from 'next/link'

import Reciters from 'src/components/reciters'

export default function Home() {
  return (
    <div className='min-h-screen p-24'>
      <Head>
        <title>Quran Player</title>
      </Head>

      <main>
        <Link href='/player'>
          <a className='hover:text-teal-700 font-bold text-2xl transition-colors duration-75'>
            انتقل إلى مشغل القرآن الكريم
          </a>
        </Link>

        <Reciters />
      </main>
    </div>
  )
}
