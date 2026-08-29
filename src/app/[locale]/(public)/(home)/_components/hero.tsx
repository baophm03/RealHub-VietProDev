"use client"

import { Button, Input } from "@base-ui/react";
import { ChevronDown, Home, Map, Search, Wallet } from "lucide-react";

export function Hero() {
  return (
    <section className="relative bg-background pt-15 -mt-20 lg:-mt-28">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(/background.jpg)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />

      <div className="relative z-10 flex min-h-[90vh] flex-col items-center justify-center gap-8 px-6 py-16 text-center">
        <div className="flex flex-col items-center justify-center gap-3">
          <h1 className="font-serif text-3xl capitalize font-semibold tracking-tight text-white drop-shadow-lg md:text-5xl lg:text-6xl">
            Tìm ngay ngôi nhà trong mơ
          </h1>
          <p className="mx-auto max-w-2xl text-sm text-white/90 drop-shadow-md md:text-base lg:text-lg">
            Hàng ngàn bất động sản từ các chủ đầu tư uy tín nơi mỗi căn nhà kể một câu chuyện riêng của bạn.
          </p>
        </div>
        <div className="flex w-full max-w-3xl flex-col gap-2 rounded-xl border border-border bg-surface/95 p-3 shadow-lg backdrop-blur-sm md:flex-row md:items-center">
          <div className="flex flex-1 items-center gap-2">
            <Map size={28} className="text-foreground-muted" />
            <Input
              onClick={() => console.log('clicked')}
              disabled
              placeholder="Hồ Chí Minh"
              className="h-10 w-full border-0 bg-transparent px-0 text-sm text-foreground placeholder:text-foreground disabled:text-foreground disabled:opacity-100 focus:outline-none"
            />
            <ChevronDown size={18} className="shrink-0 text-foreground-muted" />
          </div>
          <div className="hidden h-8 w-px bg-border md:block" />
          <div className="flex flex-1 items-center gap-2">
            <Home size={28} className="text-foreground-muted" />
            <Input
              onClick={() => console.log('clicked')}
              disabled
              placeholder="Biệt thự"
              className="h-10 w-full border-0 bg-transparent px-0 text-sm text-foreground placeholder:text-foreground disabled:text-foreground disabled:opacity-100 focus:outline-none"
            />
            <ChevronDown size={18} className="shrink-0 text-foreground-muted" />
          </div>
          <div className="hidden h-8 w-px bg-border md:block" />
          <div className="flex flex-1 items-center gap-2">
            <Wallet size={28} className="text-foreground-muted" />
            <Input
              onClick={() => console.log('clicked')}
              disabled
              placeholder="Giá từ 1 tỷ - 10 tỷ"
              className="h-10 w-full border-0 bg-transparent px-0 text-sm text-foreground placeholder:text-foreground disabled:text-foreground disabled:opacity-100 focus:outline-none"
            />
          </div>
          <Button
            onClick={() => console.log('clicked')}
            className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#092909] cursor-pointer"
          >
            <Search size={16} className="text-white" />
          </Button>
        </div>
      </div>
    </section>
  );
}
