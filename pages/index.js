import Head from 'next/head'
import Link from 'next/link'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Quran Player</title>
      </Head>

      <Link href='/player'>
        <a>Go to player</a>
      </Link>
    </div>
  )
}
