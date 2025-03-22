import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const Header = () => {
  return (
    <header className="w-full py-4">
      <div className="container flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="mr-8">
            <Image
              src="https://ext.same-assets.com/2446876795/1084794964.svg"
              alt="Stride logo"
              width={118}
              height={40}
              className="h-10 w-auto"
            />
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link href="/vaults" className="text-foreground/70 hover:text-foreground transition-colors">
              Vaults
            </Link>
            <Link href="/earn" className="text-primary font-medium">
              Earn yield
            </Link>
            <Link href="/redeem" className="text-foreground/70 hover:text-foreground transition-colors">
              Redeem
            </Link>
            <Link href="/points" className="text-foreground/70 hover:text-foreground transition-colors">
              Points program
            </Link>
            <Link href="/faq" className="text-foreground/70 hover:text-foreground transition-colors">
              FAQ
            </Link>
          </nav>
        </div>
        <Button className="bg-primary hover:bg-primary/90 text-foreground font-medium px-6">
          Connect wallet
        </Button>
      </div>
    </header>
  );
};

export default Header;
