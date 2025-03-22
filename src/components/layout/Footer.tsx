import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="w-full py-12 mt-20 border-t border-border/20">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-4">
            <Link href="/">
              <Image
                src="https://ext.same-assets.com/2446876795/1084794964.svg"
                alt="Stride logo"
                width={140}
                height={48}
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-muted-foreground text-sm max-w-md">
              Stride is offering liquid staking for the Cosmos, Celestia and Berachain ecosystems,
              helping users to optimize their reward flows and earn higher yields,
              while keeping their tokens unlocked.
            </p>
            <Link href="https://stride.zone" className="text-primary hover:underline text-sm">
              Learn more
            </Link>
            <div className="flex space-x-4 mt-4">
              <Link href="https://x.com/stride_zone" target="_blank" rel="noopener noreferrer">
                <Image
                  src="https://ext.same-assets.com/2446876795/1314914229.svg"
                  alt="X"
                  width={24}
                  height={24}
                  className="opacity-70 hover:opacity-100 transition-opacity"
                />
              </Link>
              <Link href="https://discord.com/invite/stride-zone" target="_blank" rel="noopener noreferrer">
                <Image
                  src="https://ext.same-assets.com/2446876795/1314914229.svg"
                  alt="Discord"
                  width={24}
                  height={24}
                  className="opacity-70 hover:opacity-100 transition-opacity"
                />
              </Link>
              <Link href="https://github.com/Stride-Labs/stride" target="_blank" rel="noopener noreferrer">
                <Image
                  src="https://ext.same-assets.com/2446876795/1314914229.svg"
                  alt="GitHub"
                  width={24}
                  height={24}
                  className="opacity-70 hover:opacity-100 transition-opacity"
                />
              </Link>
            </div>
          </div>
          <div className="md:col-span-2 flex justify-end">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
              <div className="space-y-3">
                <Link href="https://www.stride.zone/ecosystem" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Ecosystem
                </Link>
              </div>
              <div className="space-y-3">
                <Link href="https://www.stride.zone/security" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Safety & Security
                </Link>
              </div>
              <div className="space-y-3">
                <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  FAQ
                </Link>
              </div>
              <div className="space-y-3">
                <Link href="https://docs.stride.zone" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Docs
                </Link>
              </div>
              <div className="space-y-3">
                <Link href="https://support.stride.zone/library" className="text-muted-foreground hover:text-primary transition-colors text-sm">
                  Support
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
