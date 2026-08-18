import {
  Eye,
  Globe,
  Handshake,
  LineChart,
  Target,
  Users,
} from "lucide-react";

export const dynamic = "force-static";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-8 md:py-24 lg:px-12">
      <div className="mb-16 flex flex-col gap-4 animate-[fade-up_0.7s_ease-out]">
        <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-primary">
          Về chúng tôi
        </span>
        <h1 className="max-w-[20ch] font-serif text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
          Nền tảng kết nối toàn vòng đời bất động sản
        </h1>
        <p className="max-w-[56ch] text-base leading-relaxed text-foreground-muted md:text-lg">
          RealHub là hệ sinh thái đa tenant cho Agency, Developer và Distributor —
          kết nối sản phẩm, khách hàng, lịch hẹn, giao dịch và hoa hồng trên một nền tảng duy nhất.
        </p>
      </div>

      <div className="mb-20 grid gap-8 md:grid-cols-2">
        <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-8">
          <Target size={28} className="text-primary" />
          <h2 className="font-serif text-2xl font-semibold">Sứ mệnh</h2>
          <p className="text-base leading-relaxed text-foreground-muted">
            Democratize công nghệ bất động sản — giúp mọi agency, từ nhỏ đến lớn,
            vận hành chuyên nghiệp với công cụ mạnh mẽ nhưng dễ sử dụng.
          </p>
        </div>
        <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-8">
          <Eye size={28} className="text-primary" />
          <h2 className="font-serif text-2xl font-semibold">Tầm nhìn</h2>
          <p className="text-base leading-relaxed text-foreground-muted">
            Trở thành nền tảng bất động sản số 1 Đông Nam Á,
            nơi mọi giao dịch đều minh bạch, hiệu quả và dễ dàng.
          </p>
        </div>
      </div>

      <div className="mb-20">
        <h2 className="mb-8 font-serif text-3xl font-semibold tracking-tight">Giá trị cốt lõi</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Users, title: "Con người là trọng tâm", desc: "Mỗi tính năng đều được thiết kế cho người dùng — từ khách hàng đến sales, từ owner đến admin." },
            { icon: Handshake, title: "Minh bạch & Tin cậy", desc: "Mọi giao dịch, hoa hồng, phân bổ lead đều có audit log rõ ràng, không mập mờ." },
            { icon: Globe, title: "Hệ sinh thái mở", desc: "Kết nối Agency, Developer, Distributor và đối tác trên một nền tảng chung." },
          ].map((v) => (
            <div
              key={v.title}
              className="flex flex-col gap-3 animate-[fade-up_0.5s_ease-out_both]"
            >
              <v.icon size={24} className="text-primary" />
              <h3 className="font-serif text-lg font-semibold">{v.title}</h3>
              <p className="text-sm leading-relaxed text-foreground-muted">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg bg-primary p-12 text-center text-primary-foreground">
        <LineChart size={32} className="mx-auto mb-4 text-primary-foreground/60" />
        <h2 className="mb-2 font-serif text-3xl font-semibold">45+ Agency tin dùng</h2>
        <p className="text-primary-foreground/70">Và con số vẫn đang tăng mỗi tháng</p>
      </div>
    </div>
  );
}
