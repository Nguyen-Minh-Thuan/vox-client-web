import { useEffect, useState } from 'react'
import { Check, Plus, X } from 'lucide-react'
import type { FrameworkSignalInput, SignalImportance } from '../types'

type FrameworkSignalListEditorProps = {
  disabled?: boolean
  onChange: (signals: FrameworkSignalInput[]) => void
  signals: FrameworkSignalInput[]
}

const emptyForm = {
  code: '',
  description: '',
  evidenceHint: '',
  importance: 'MEDIUM' as SignalImportance,
}

export function FrameworkSignalListEditor({
  disabled,
  onChange,
  signals,
}: FrameworkSignalListEditorProps) {
  const [form, setForm] = useState(emptyForm)
  const [status, setStatus] = useState<{
    text: string
    type: 'error' | 'success'
  } | null>(null)

  useEffect(() => {
    if (!status) {
      return
    }

    const timer = setTimeout(() => setStatus(null), 2000)
    return () => clearTimeout(timer)
  }, [status])

  const canAdd = Boolean(form.code.trim() && form.description.trim())

  function handleAdd() {
    if (!canAdd) {
      setStatus({ text: 'Vui lòng nhập Mã và Mô tả trước khi thêm.', type: 'error' })
      return
    }

    onChange([
      ...signals,
      {
        code: form.code.trim(),
        description: form.description.trim(),
        evidenceHint: form.evidenceHint.trim() || null,
        importance: form.importance,
      },
    ])
    setStatus({ text: `Đã thêm dấu hiệu "${form.code.trim()}".`, type: 'success' })
    setForm(emptyForm)
  }

  function handleRemove(index: number) {
    onChange(signals.filter((_, i) => i !== index))
    setStatus({ text: `Đã xóa dấu hiệu "${signals[index].code}".`, type: 'success' })
  }

  return (
    <div className="grid gap-2">
      {signals.length === 0 ? (
        <p className="text-xs font-medium text-slate-400">Chưa có dấu hiệu nào.</p>
      ) : null}
      <div className="flex flex-wrap gap-1.5">
        {signals.map((signal, index) => (
          <span
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700"
            key={`${signal.code}-${index}`}
          >
            {signal.code}: {signal.description}
            {!disabled ? (
              <button
                aria-label={`Xóa dấu hiệu ${signal.code}`}
                className="text-slate-400 hover:text-red-600"
                onClick={() => handleRemove(index)}
                type="button"
              >
                <X aria-hidden="true" className="size-3" />
              </button>
            ) : null}
          </span>
        ))}
      </div>

      {!disabled ? (
        <div className="flex flex-wrap items-center gap-1.5">
          <input
            className="h-8 w-20 rounded border border-slate-200 px-2 text-xs font-medium text-blue-950 outline-none focus:border-indigo-500"
            onChange={(event) =>
              setForm((current) => ({ ...current, code: event.target.value }))
            }
            placeholder="Mã"
            value={form.code}
          />
          <input
            className="h-8 min-w-32 flex-1 rounded border border-slate-200 px-2 text-xs font-medium text-blue-950 outline-none focus:border-indigo-500"
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            placeholder="Mô tả"
            value={form.description}
          />
          <select
            className="h-8 rounded border border-slate-200 px-1 text-xs font-medium text-blue-950 outline-none focus:border-indigo-500"
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                importance: event.target.value as SignalImportance,
              }))
            }
            value={form.importance}
          >
            <option value="HIGH">Cao</option>
            <option value="MEDIUM">Trung bình</option>
            <option value="LOW">Thấp</option>
          </select>
          <input
            className="h-8 min-w-28 flex-1 rounded border border-slate-200 px-2 text-xs font-medium text-blue-950 outline-none focus:border-indigo-500"
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                evidenceHint: event.target.value,
              }))
            }
            placeholder="Gợi ý minh chứng"
            value={form.evidenceHint}
          />
          <button
            aria-label="Thêm dấu hiệu"
            className="inline-flex size-8 items-center justify-center rounded border border-slate-200 text-indigo-700 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
            disabled={!canAdd}
            onClick={handleAdd}
            type="button"
          >
            <Plus aria-hidden="true" className="size-4" />
          </button>
        </div>
      ) : null}

      {status ? (
        <p
          className={`flex items-center gap-1 text-xs font-semibold ${status.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}
          role="status"
        >
          {status.type === 'success' ? (
            <Check aria-hidden="true" className="size-3.5" />
          ) : null}
          {status.text}
        </p>
      ) : null}
    </div>
  )
}
