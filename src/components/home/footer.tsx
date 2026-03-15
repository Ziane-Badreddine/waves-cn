import { SiGithub, SiX } from "@icons-pack/react-simple-icons"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t px-4 md:px-6">
      <div className=" flex flex-col gap-4 py-4 md:flex-row  md:h-14 items-center justify-between text-sm text-muted-foreground">
        
        <p>
          Built by{" "}
          <Link
            href="https://github.com/MouadSadik"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Mouad Sadik
          </Link>{" "}
          and{" "}
          <Link
            href="https://github.com/Ziane-Badreddine"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            Badreddine Ziane
          </Link>
        </p>

        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/Ziane-Badreddine/waves-cn"
            target="_blank"
            rel="noreferrer"
            className="hover:opacity-80"
          >
            <SiGithub className="size-4" />
          </Link>

          <Link
            href="https://x.com/wavescn0"
            target="_blank"
            rel="noreferrer"
            className="hover:opacity-80"
          >
            <SiX className="size-4" />
          </Link>
        </div>

      </div>
    </footer>
  )
}
