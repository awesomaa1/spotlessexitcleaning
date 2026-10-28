import { assets } from "../data/content"

const sizes = {
  default: "[--s:0.64] min-[360px]:[--s:0.72] md:[--s:0.86] 2xl:[--s:1]",
  compact: "[--s:0.52] min-[360px]:[--s:0.6] md:[--s:0.7]",
}

/** Hero lockup: wordmark SVG, "exit cleaning" caption and flanking rules, scaled as one unit. */
export default function Logo({
  size = "default",
}: {
  size?: keyof typeof sizes
}) {
  return (
    <a
      href="#top"
      aria-label="Spotless Cleaning home"
      className={`relative block shrink-0 h-[calc(62.914px*var(--s))] w-[calc(185.88px*var(--s))] ${sizes[size]}`}
    >
      <span className="absolute left-0 top-0 h-[62.914px] w-[185.88px] origin-top-left scale-(--s)">
        <img
          src={assets.logoWordmark}
          alt=""
          width={185.881}
          height={42.1083}
          className="absolute left-0 top-0 block h-[42.108px] w-[185.88px] max-w-none"
        />
        <span className="ff-geist absolute left-[39.17px] top-[38.88px] whitespace-nowrap text-[18.494px] leading-[normal] text-white">
          exit cleaning
        </span>
        <img
          src={assets.logoRule}
          alt=""
          width={36.5018}
          height={2.3741}
          className="absolute left-0 top-[49.57px] block h-[2.374px] w-[36.502px] max-w-none rotate-180"
        />
        <img
          src={assets.logoRule}
          alt=""
          width={36.5018}
          height={2.3741}
          className="absolute left-[149.27px] top-[49.57px] block h-[2.374px] w-[36.502px] max-w-none rotate-180"
        />
      </span>
    </a>
  )
}
