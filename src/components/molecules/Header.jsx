import { GradientText } from "@/components/atoms/GradientText"

export function Header() {
  return (
    <header className="relative z-20 px-6 py-12 md:px-12 md:py-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-6 leading-tight">
          <GradientText>RoninDezigns</GradientText>
        </h1>
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground/90 max-w-3xl">
          I will help you build <span className="text-red-400 font-bold">YOUR</span> ideas
          together with <span className="text-blue-400 font-bold">YOUR</span> vision
        </h2>
      </div>
    </header>
  )
}


