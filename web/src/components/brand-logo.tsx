import Image from "next/image";
import Link from "next/link";

export function BrandLogo({
  href = "/",
  label = "Crunchify home",
}: {
  href?: string;
  label?: string;
}) {
  return (
    <Link className="brand" href={href} aria-label={label}>
      <span className="brand-crop">
        <Image src="/brand/logo.webp" alt="" width={800} height={800} />
      </span>
    </Link>
  );
}
