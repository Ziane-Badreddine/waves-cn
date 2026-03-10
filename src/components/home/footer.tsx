import {
  SiBluesky,
  SiGithub,
  SiTwitch,
  SiX,
  SiYoutube
} from '@icons-pack/react-simple-icons'
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="mt-auto w-full border-t bg-zinc-50/50 py-12 dark:bg-zinc-900/20">
      <nav className="container px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="space-y-4">
            <h1 className='text-3xl'>waves-cn</h1>
            <p className="text-sm text-zinc-500">
              Made by{' '}
              <a
                href="https://github.com/MouadSadik"
                className="font-semibold hover:underline"
              >
                Mouad Sadik
              </a>{' '}
              and{' '}
              <a
                href="https://github.com/Ziane-Badreddine"
                className="font-semibold hover:underline"
              >
                Badreddine Ziane
              </a>
              <br />
              <a
                href="https://github.com/Ziane-Badreddine/waves-cn/blob/next/LICENSE"
                className="hover:underline"
              >
                MIT License
              </a>{' '}
              © 2026
            </p>
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/docs" className="hover:underline" prefetch={false}>
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:underline" prefetch={false}>
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/stats"
                  className="hover:underline"
                  prefetch={false}
                >
                  Project Stats
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">Social</h3>
            <ul className="space-y-1">
              <li>
                <a
                  href="https://github.com/Ziane-Badreddine/waves-cn"
                  className="inline-flex items-center gap-1 hover:underline"
                >
                  <SiGithub role="presentation" className="mr-2 size-5" />
                  <span>GitHub</span>
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/wavescn0"
                  className="inline-flex items-center gap-1 hover:underline"
                >
                  <SiX role="presentation" className="mr-2 size-5" />
                  <span>X / Twitter</span>
                </a>
              </li>
              <li>
                <a
                  href="https://bsky.app/profile/wavescn.dev"
                  className="inline-flex items-center gap-1 hover:underline"
                >
                  <SiBluesky role="presentation" className="mr-2 size-5" />
                  <span>Bluesky</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/@wavescn"
                  className="inline-flex items-center gap-1 hover:underline"
                >
                  <SiYoutube role="presentation" className="mr-2 size-5" />
                  <span>YouTube</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.twitch.tv/wavescn"
                  className="inline-flex items-center gap-1 hover:underline"
                >
                  <SiTwitch role="presentation" className="mr-2 size-5" />
                  <span>Twitch</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </footer>
  )
}