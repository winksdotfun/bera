import Image from "next/image";

const HeroSection = () => {
  return (
    <section className="w-full py-1 text-center">
      <div className="container max-w-4xl">
        <div className="flex items-center justify-center gap-2">
          <p className=" text-muted-foreground">Utilize your</p>
          <div className="flex items-center">
            <Image
              src="https://ext.same-assets.com/2446876795/1753465442.svg"
              alt="stBGT"
              width={20}
              height={20}
              className="mr-1"
            />
            <span className="text-lg">stBGT</span>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-foreground leading-tight">
          Get the best yield in the <br /> Berachain ecosystem
        </h1>
      </div>
    </section>
  );
};

export default HeroSection;
