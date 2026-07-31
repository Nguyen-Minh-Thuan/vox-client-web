import {
  AlertTriangle,
  ArrowUpRight,
  Ban,
  CalendarClock,
  CalendarDays,
  Coins,
  Flag,
  Gavel,
  Hourglass,
  Info,
  Loader,
  Lock,
  Megaphone,
  Play,
  RefreshCw,
  ShieldCheck,
  SquarePen,
  Wallet,
  X,
} from 'lucide-react'
import { useAppSelector } from '@/app/store/hooks'
import { useSchoolAdminDashboardQuery, type SchoolAdminDashboard } from '../api/useSchoolAdminDashboardQuery'

const EXAM_STATUS = [
  { color: '#94A3B8', icon: <SquarePen aria-hidden="true" className="size-4.5" />, key: 'draft' as const, label: 'Bản nháp' },
  { color: '#4F46E5', icon: <CalendarClock aria-hidden="true" className="size-4.5" />, key: 'scheduled' as const, label: 'Đã lên lịch' },
  { color: '#F59E0B', icon: <Play aria-hidden="true" className="size-4.5" />, key: 'inProgress' as const, label: 'Đang diễn ra' },
  { color: '#06B6D4', icon: <Lock aria-hidden="true" className="size-4.5" />, key: 'closed' as const, label: 'Đã đóng' },
  { color: '#10B981', icon: <Flag aria-hidden="true" className="size-4.5" />, key: 'resultsPublished' as const, label: 'Đã công bố KQ' },
  { color: '#EF4444', icon: <Ban aria-hidden="true" className="size-4.5" />, key: 'cancelled' as const, label: 'Đã hủy' },
]

const APPEAL_STATUS = [
  { color: '#F59E0B', hot: true, icon: <Hourglass aria-hidden="true" className="size-4" />, key: 'pending' as const, label: 'Chờ xử lý' },
  { color: '#4F46E5', icon: <Loader aria-hidden="true" className="size-4" />, key: 'processing' as const, label: 'Đang xử lý' },
  { color: '#10B981', icon: <Megaphone aria-hidden="true" className="size-4" />, key: 'published' as const, label: 'Đã công bố' },
  { color: '#94A3B8', icon: <X aria-hidden="true" className="size-4" />, key: 'rejected' as const, label: 'Từ chối' },
]

const fmt = (n: number) => n.toLocaleString('vi-VN')

function Kpi({
  accent,
  cta,
  icon,
  label,
  onCta,
  sub,
  tint,
  unit,
  value,
}: {
  accent?: boolean
  cta?: string
  icon: React.ReactNode
  label: string
  onCta?: () => void
  sub: React.ReactNode
  tint?: { bg: string; fg: string }
  unit?: string
  value: React.ReactNode
}) {
  return (
    <div
      className={
        accent
          ? 'flex min-h-38 flex-col rounded-2xl bg-linear-to-br from-indigo-600 to-cyan-500 p-5 text-white shadow-lg shadow-indigo-950/20'
          : 'flex min-h-38 flex-col rounded-2xl border border-slate-200 bg-white p-5'
      }
    >
      <div className="flex items-center gap-2.5">
        <span
          className={
            accent
              ? 'flex size-10 items-center justify-center rounded-[11px] bg-white/20 text-white'
              : `flex size-10 items-center justify-center rounded-[11px] ${tint?.bg} ${tint?.fg}`
          }
        >
          {icon}
        </span>
        <span className={accent ? 'text-sm font-semibold text-white/85' : 'text-sm font-semibold text-slate-500'}>{label}</span>
      </div>
      <div className={accent ? 'mt-3.5 text-4xl font-extrabold tracking-tight' : 'mt-3.5 text-4xl font-extrabold tracking-tight text-slate-900'}>
        {value}
        {unit ? <small className="ml-1 text-base font-bold text-slate-400">{unit}</small> : null}
      </div>
      <div className={accent ? 'mt-3 text-sm text-white/85' : 'mt-3 text-sm text-slate-500'}>{sub}</div>
      {cta ? (
        <button
          className="mt-auto inline-flex w-fit items-center gap-1.5 self-start rounded-full bg-white/15 px-3.5 py-1.5 text-sm font-bold text-white transition hover:bg-white/25"
          onClick={onCta}
          type="button"
        >
          {cta}
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </button>
      ) : null}
    </div>
  )
}

function Donut({ center, segments, sub }: { center: number; segments: { color: string; label: string; value: number }[]; sub: string }) {
  const visible = segments.filter((s) => s.value > 0)
  const total = visible.reduce((s, x) => s + x.value, 0)
  const stops = total
    ? visible
        .reduce<{ acc: number; parts: string[] }>(
          (state, s) => {
            const from = (state.acc / total) * 360
            const acc = state.acc + s.value
            const to = (acc / total) * 360
            return { acc, parts: [...state.parts, `${s.color} ${from}deg ${to}deg`] }
          },
          { acc: 0, parts: [] },
        )
        .parts.join(',')
    : '#E2E8F0 0deg 360deg'

  return (
    <div className="flex items-center gap-6">
      <div className="size-40 shrink-0 rounded-full" style={{ background: `conic-gradient(${stops})` }}>
        <div className="m-6.5 flex size-27 flex-col items-center justify-center rounded-full bg-white">
          <div className="text-3xl font-extrabold text-slate-900 tabular-nums">{fmt(center)}</div>
          <div className="mt-0.5 text-xs font-semibold text-slate-500">{sub}</div>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3.5">
        {segments.map((s) => (
          <div className="flex items-center gap-2.5" key={s.label}>
            <span className="size-3 shrink-0 rounded-[4px]" style={{ background: s.color }} />
            <span className="text-sm font-semibold text-slate-600">{s.label}</span>
            <span className="ml-auto text-base font-extrabold text-slate-900 tabular-nums">{fmt(s.value)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ExamStatusCard({ c }: { c: SchoolAdminDashboard['examStatusCounts'] }) {
  const segments = EXAM_STATUS.map((s) => ({ color: s.color, label: s.label, value: c[s.key] }))
  const live = c.inProgress + c.scheduled

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5.5">
      <div className="mb-4.5 flex items-start gap-3.5">
        <div>
          <h3 className="text-base font-extrabold tracking-tight text-slate-900">Trạng thái phòng thi</h3>
          <p className="mt-0.5 text-[13px] text-slate-500">Phân bố kỳ thi của trường theo trạng thái</p>
        </div>
        <div className="ml-auto text-right text-[22px] font-extrabold text-slate-900 tabular-nums">
          {c.total}
          <small className="block text-[11.5px] font-semibold text-slate-500">tổng kỳ thi</small>
        </div>
      </div>
      <Donut center={c.total} segments={segments} sub="kỳ thi" />
      <div className="mt-5.5 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className="flex items-center gap-2.5 text-[13.5px] text-slate-600">
          <Play aria-hidden="true" className="size-4.5 text-amber-500" />
          <span>
            <b className="text-slate-900">{live}</b> kỳ thi sắp tới & đang diễn ra
          </span>
        </div>
        <a className="inline-flex items-center gap-1 text-[13.5px] font-bold text-indigo-600 hover:text-indigo-700" href="/school-admin/exams">
          Quản lý phòng thi
          <ArrowUpRight aria-hidden="true" className="size-3.5" />
        </a>
      </div>
    </div>
  )
}

function TokenGauge({ tokenAllocated, tokenUsed }: { tokenAllocated: number; tokenUsed: number }) {
  const hasSub = tokenAllocated > 0
  const pct = hasSub ? Math.round((tokenUsed / tokenAllocated) * 100) : 0
  const remaining = Math.max(tokenAllocated - tokenUsed, 0)
  const level = pct >= 90 ? 'crit' : pct >= 75 ? 'warn' : 'ok'
  const fillClass = level === 'crit' ? 'bg-linear-to-r from-red-500 to-red-400' : level === 'warn' ? 'bg-linear-to-r from-amber-500 to-amber-400' : 'bg-linear-to-r from-indigo-600 to-cyan-500'
  const pctClass = level === 'crit' ? 'bg-red-50 text-red-700' : level === 'warn' ? 'bg-amber-50 text-amber-700' : 'bg-indigo-50 text-indigo-600'

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5.5">
      <div className="mb-5">
        <h3 className="text-base font-extrabold tracking-tight text-slate-900">Sử dụng token</h3>
        <p className="mt-0.5 text-[13px] text-slate-500">Hạn mức token AI của gói hiện tại</p>
      </div>
      {hasSub ? (
        <>
          <div className="flex items-baseline gap-2.5">
            <span className="text-4xl font-extrabold tracking-tight text-slate-900 tabular-nums">{fmt(tokenUsed)}</span>
            <span className="text-base font-semibold text-slate-500">/ {fmt(tokenAllocated)} token</span>
            <span className={`ml-auto inline-flex items-center gap-1.5 self-center rounded-full px-3 py-1 text-sm font-extrabold ${pctClass}`}>{pct}%</span>
          </div>
          <div className="my-5 h-4 overflow-hidden rounded-full bg-slate-100">
            <div className={`h-full rounded-full ${fillClass}`} style={{ width: `${pct}%` }} />
          </div>
          <div className="flex gap-3.5 border-t border-slate-100 pt-4.5">
            <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3.5">
              <div className="text-[22px] font-extrabold text-slate-900 tabular-nums">{fmt(remaining)}</div>
              <div className="mt-1.5 text-[12.5px] font-semibold text-slate-500">Token còn lại</div>
            </div>
            <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3.5">
              <div className="text-[22px] font-extrabold text-slate-900 tabular-nums">{pct}%</div>
              <div className="mt-1.5 text-[12.5px] font-semibold text-slate-500">Đã tiêu thụ</div>
            </div>
          </div>
          <div className="mt-3.5 flex items-center gap-2 text-[13px] text-slate-500">
            <Info aria-hidden="true" className="size-4.5 text-slate-400" />
            <span>Token dùng cho chấm điểm & phản hồi AI. Đặt lại vào đầu chu kỳ gia hạn.</span>
          </div>
        </>
      ) : (
        <div className="flex items-center gap-2.5 rounded-xl border border-orange-200 bg-orange-50 px-4 py-3.5 text-[13.5px] font-semibold text-orange-800">
          <Info aria-hidden="true" className="size-5 text-orange-600" />
          <span>Chưa có gói đăng ký đang hoạt động — hạn mức token bằng 0.</span>
        </div>
      )}
    </div>
  )
}

function Appeals({ a }: { a: SchoolAdminDashboard['appealStats'] }) {
  const total = APPEAL_STATUS.reduce((s, x) => s + a[x.key], 0)
  const resolved = a.published + a.rejected
  const rate = resolved ? Math.round((a.published / resolved) * 100) : 0

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5.5" id="appeals">
      <div className="mb-4.5 flex items-start gap-3.5">
        <div>
          <h3 className="text-base font-extrabold tracking-tight text-slate-900">Yêu cầu khiếu nại</h3>
          <p className="mt-0.5 text-[13px] text-slate-500">Phúc khảo điểm thi trong toàn trường</p>
        </div>
        <div className="ml-auto text-right text-[22px] font-extrabold text-slate-900 tabular-nums">
          {total}
          <small className="block text-[11.5px] font-semibold text-slate-500">tổng đơn</small>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3.5">
        {APPEAL_STATUS.map((s) => (
          <div
            className={`relative rounded-[14px] border p-4 ${s.hot && a[s.key] > 0 ? 'border-orange-200 bg-orange-50/50' : 'border-slate-200 bg-white'}`}
            key={s.key}
          >
            <div className="mb-3 flex items-center gap-2">
              <span className="size-2.25 shrink-0 rounded-full" style={{ background: s.color }} />
              <span className="text-[13px] font-bold text-slate-600">{s.label}</span>
            </div>
            <div className="text-[32px] font-extrabold leading-none tracking-tight text-slate-900 tabular-nums">{a[s.key]}</div>
            {s.hot && a[s.key] > 0 ? (
              <a className="absolute right-4 top-4 inline-flex items-center gap-0.5 text-[11.5px] font-bold text-orange-600" href="#appeals">
                Xử lý
                <ArrowUpRight aria-hidden="true" className="size-3.5" />
              </a>
            ) : null}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-[13.5px] text-slate-600">
        <span>
          <b className="text-slate-900">{a.pending + a.processing}</b> đơn đang mở · <b className="text-slate-900">{resolved}</b> đã xử lý
        </span>
        <span className="inline-flex items-center gap-1.5 font-bold text-emerald-700">
          <Flag aria-hidden="true" className="size-4.5" />
          {rate}% được chấp thuận
        </span>
      </div>
    </div>
  )
}

function ExamPipeline({ c }: { c: SchoolAdminDashboard['examStatusCounts'] }) {
  const max = Math.max(...EXAM_STATUS.map((s) => c[s.key]), 1)

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5.5">
      <div className="mb-4.5">
        <h3 className="text-base font-extrabold tracking-tight text-slate-900">Vòng đời kỳ thi</h3>
        <p className="mt-0.5 text-[13px] text-slate-500">Số phòng thi tại mỗi giai đoạn</p>
      </div>
      <div className="flex flex-col gap-3.5">
        {EXAM_STATUS.map((s) => (
          <div className="flex items-center gap-3.5" key={s.key}>
            <span className="w-28 shrink-0 text-[13px] font-semibold text-slate-600">{s.label}</span>
            <div className="h-3 flex-1 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full" style={{ background: s.color, width: `${(c[s.key] / max) * 100}%` }} />
            </div>
            <span className="w-8 text-right text-[15px] font-extrabold text-slate-900 tabular-nums">{c[s.key]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SchoolAdminDashboardPage() {
  const user = useAppSelector((state) => state.auth.user)
  const { data, isLoading, isError, refetch } = useSchoolAdminDashboardQuery()

  function jumpToAppeals() {
    document.getElementById('appeals')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
        <RefreshCw className="size-8 animate-spin text-indigo-600" />
        <p className="text-sm text-slate-500">Đang tải tổng quan trường...</p>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <AlertTriangle className="size-12 text-red-500" />
        <p className="text-slate-600">Không tải được dữ liệu tổng quan trường.</p>
        <button className="rounded-lg bg-indigo-600 px-4 py-2 font-bold text-white hover:bg-indigo-700" onClick={() => refetch()} type="button">
          Thử lại
        </button>
      </div>
    )
  }

  const c = data.examStatusCounts
  const revBig = (data.revenue / 1e6).toLocaleString('vi-VN', { maximumFractionDigits: 1 })
  const tokenPct = data.tokenAllocated > 0 ? Math.round((data.tokenUsed / data.tokenAllocated) * 100) : 0

  return (
    <section className="grid gap-5">
      <div className="flex flex-wrap items-start gap-5">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1 text-[11.5px] font-bold tracking-wide text-violet-700">
            <ShieldCheck aria-hidden="true" className="size-3.5" /> Chỉ dành cho SCHOOL_ADMIN
          </span>
          <h1 className="mt-2.5 text-3xl font-extrabold tracking-tight text-slate-900">Tổng quan trường</h1>
          <p className="mt-1.5 max-w-160 text-[15px] text-slate-500">
            Toàn cảnh hoạt động của trường — phòng thi, khiếu nại, mức dùng token và doanh thu của trường
            {user?.email ? ` · ${user.email}` : ''}.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          icon={<CalendarDays aria-hidden="true" className="size-5.5" />}
          label="Tổng số kỳ thi"
          sub={
            <span className="font-semibold text-slate-600">
              <b className="text-slate-900">{c.inProgress}</b> đang diễn ra · <b className="text-slate-900">{c.scheduled}</b> đã lên lịch
            </span>
          }
          tint={{ bg: 'bg-indigo-50', fg: 'text-indigo-700' }}
          value={c.total}
        />
        <Kpi
          icon={<Flag aria-hidden="true" className="size-5.5" />}
          label="Kết quả đã công bố"
          sub={<span className="font-semibold text-slate-600">Kỳ thi đã công bố điểm cho học sinh</span>}
          tint={{ bg: 'bg-emerald-50', fg: 'text-emerald-700' }}
          value={c.resultsPublished}
        />
        <Kpi
          icon={<Coins aria-hidden="true" className="size-5.5" />}
          label="Token đã dùng"
          sub={<span className="font-semibold text-slate-600">{fmt(data.tokenUsed)} / {fmt(data.tokenAllocated)} token</span>}
          tint={{ bg: 'bg-orange-50', fg: 'text-orange-700' }}
          unit="%"
          value={tokenPct}
        />
        <Kpi
          accent
          cta="Xử lý ngay"
          icon={<Gavel aria-hidden="true" className="size-5.5" />}
          label="Khiếu nại chờ xử lý"
          onCta={jumpToAppeals}
          sub="Đơn phúc khảo cần được xử lý"
          value={data.appealStats.pending}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.55fr_1fr]">
        <ExamStatusCard c={c} />
        <TokenGauge tokenAllocated={data.tokenAllocated} tokenUsed={data.tokenUsed} />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1fr_1.35fr]">
        <Appeals a={data.appealStats} />
        <ExamPipeline c={c} />
      </div>

      <div className="flex flex-wrap items-center gap-5 rounded-2xl border border-slate-200 bg-white p-5.5">
        <div className="flex size-13 shrink-0 items-center justify-center rounded-[13px] bg-emerald-50 text-emerald-700">
          <Wallet aria-hidden="true" className="size-6.5" />
        </div>
        <div>
          <div className="text-[13.5px] font-semibold text-slate-500">Doanh thu của trường</div>
          <div className="mt-0.5 text-3xl font-extrabold tracking-tight text-slate-900 tabular-nums">
            {fmt(data.revenue)} <small className="text-base font-bold text-slate-400">₫</small>
          </div>
        </div>
        <div className="ml-auto max-w-70 text-right text-[13.5px] font-medium text-slate-500">
          Tổng số tiền đã thanh toán trên toàn thời gian · chỉ tính hóa đơn ở trạng thái <b className="text-slate-900">PAID</b>.
        </div>
      </div>

      <div className="text-[13px] text-slate-400">Doanh thu {revBig}tr ₫ trong kỳ hiện tại.</div>
    </section>
  )
}
