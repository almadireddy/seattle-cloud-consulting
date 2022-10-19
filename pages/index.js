import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Seattle Cloud Consulting</title>
        <meta name="description" content="Full stack, front end, back end, and cloud consulting." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Seattle Cloud Consulting</h1>
        <p className={styles.subtitle}>We help clients make great things.</p>
        
        <div className={styles.description}>
          <p>Proven industry expertise in backend, frontend, and cloud infrastructure --</p>
          <p>We help clients create beautiful and accessible user experiences in <span className={styles.emphasis}>React</span></p>
          <p>We help clients build reliable and performant applications in <span className={styles.emphasis}>Javascript, Java, Python, and C#</span></p>
          <p>We help clients deliver their applications in <span className={styles.emphasis}>AWS, Azure, and GCP</span></p>
        </div>

        {/* <div className={styles.callToAction}>
          <p>Get in touch now &#8594;</p>
        </div> */}
      </main>
    </div>
  )
}
