'use client';

import Link from 'next/link';
import { ArrowLeft, Compass, House } from 'lucide-react';

export default function notFound() {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-background px-6 py-24">
      <div className="flex w-full max-w-xl flex-col items-center gap-10 text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-foreground-muted">
          Lỗi 404 · Trang không tồn tại
        </p>

        <h1
          className="font-serif text-[7rem] leading-[1.05] tracking-tighter text-balance text-primary sm:text-[9rem]"
          style={{ fontFeatureSettings: '"liga" 1, "dlig" 1' }}
        >
          404
        </h1>

        <div className="flex flex-col gap-3">
          <h2 className="font-serif text-2xl font-semibold tracking-tight text-balance text-primary sm:text-3xl">
            Không tìm thấy trang này
          </h2>
          <p className="text-sm text-foreground-muted text-pretty max-w-md mx-auto">
            Trang bạn đang tìm có thể đã bị di chuyển, đổi tên, hoặc không tồn tại
            trong hệ thống. Vui lòng kiểm tra lại đường dẫn hoặc quay về trang chủ.
          </p>
        </div>

        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]"
          >
            <House size={16} />
            Về trang chủ
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-5 py-2.5 text-sm font-medium text-foreground transition-all hover:bg-surface-muted active:scale-[0.98]"
          >
            <ArrowLeft size={16} />
            Quay lại
          </button>
        </div>

        <div className="flex items-center gap-2 pt-4 text-xs text-foreground-muted">
          <Compass size={14} aria-hidden="true" />
          <span>
            Kiểm tra lại URL hoặc liên hệ quản trị viên nếu bạn cho rằng đây là lỗi.
          </span>
        </div>
      </div>
    </div>
  );
}
