import { useEffect, useState } from 'react'
import { Check, Pencil, Plus, Trash2, X } from 'lucide-react'
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

const importanceLabels: Record<SignalImportance, string> = {
  HIGH: 'Cao',
  LOW: 'Thấp',
  MEDIUM: 'Trung bình',
}

export function FrameworkSignalListEditor({
  disabled,
  onChange,
  signals,
}: FrameworkSignalListEditorProps) {
  const [form, setForm] = useState(emptyForm)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [removeIndex, setRemoveIndex] = useState<number | null>(null)
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

  function handleSubmit() {
    if (!canAdd) {
      setStatus({
        text: 'Vui lòng nhập Mã và Mô tả trước khi thêm.',
        type: 'error',
      })
      return
    }

    const entry = 
    {
      code: form.code.trim(),
      description: form.description.trim(),
      evidenceHint: form.evidenceHint.trim() || null,
      importance: form.importance,
    }

    if (editingIndex !== null) {
      onChange(signals.map((s, i) => (i === editingIndex ? entry : s)))
      setStatus({ text: `Đã cập nhật dấu hiệu "${entry.code}".`, type: 'success' })
      setEditingIndex(null)
    } else {
      onChange([...signals, entry])
      setStatus({ text: `Đã thêm dấu hiệu "${entry.code}".`, type: 'success' })
    }

    setForm(emptyForm)
  }

  function handleEdit(index: number) {
    const signal = signals[index]
    setForm({
      code: signal.code,
      description: signal.description,
      evidenceHint: signal.evidenceHint ?? '',
      importance: signal.importance,
    })
    setEditingIndex(index)
    setStatus(null)
  }

  function handleCancelEdit() {
    setForm(emptyForm)
    setEditingIndex(null)
  }

  function handleRemove(index: number) {
    onChange(signals.filter((_, i) => i !== index))
    setStatus({ text: `Đã xóa dấu hiệu "${signals[index].code}".`, type: 'success' })
    setRemoveIndex(null)

    if (editingIndex === index) {
      handleCancelEdit()
    }
  }

  return (
    <div className="grid gap-2">
      {signals.length === 0 ? (
        <p className="text-xs font-medium text-slate-400">Chưa có dấu hiệu nào.</p>
      ) : null}
      <div className="grid gap-1.5 sm:grid-cols-2">
        {signals.map((signal, index) => (
          <div
            className={`grid gap-1 rounded-lg border px-2.5 py-2 text-xs text-slate-700 ${index === editingIndex ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 bg-slate-50'}`}
            key={`${signal.code}-${index}`}
          >
            <div className="flex items-start justify-between gap-2">
              <span className="font-bold text-blue-950">{signal.code}</span>
              <div className="flex shrink-0 items-center gap-1.5">
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-600">
                  {importanceLabels[signal.importance]}
                </span>
                {!disabled ? (
                  <button
                    aria-label={`Sửa dấu hiệu ${signal.code}`}
                    className="text-slate-400 hover:text-indigo-600"
                    onClick={() => handleEdit(index)}
                    type="button"
                  >
                    <Pencil aria-hidden="true" className="size-3" />
                  </button>
                ) : null}
            {!disabled ? (
              <button
                aria-label={`Xóa dấu hiệu ${signal.code}`}
                className="text-slate-400 hover:text-red-600"
                onClick={() => setRemoveIndex(index)}
                type="button"
              >
                <X aria-hidden="true" className="size-3" />
              </button>
            ) : null}
              </div>
            </div>
            <p className="font-medium">{signal.description}</p>
            {signal.evidenceHint ? (
              <p className="text-slate-500">Gợi ý minh chứng: {signal.evidenceHint}</p>
            ) : null}
          </div>
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
            title={form.code}
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
            title={form.description}
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
            title={form.evidenceHint}
            value={form.evidenceHint}
          />
          <button
            aria-label={editingIndex !== null ? 'Lưu dấu hiệu' : 'Thêm dấu hiệu'}
            className="inline-flex h-8 items-center justify-center gap-1 rounded border border-slate-200 px-2 text-xs font-bold text-indigo-700 hover:bg-indigo-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
            disabled={!canAdd}
            onClick={handleSubmit}
            type="button"
          >
            {editingIndex !== null ? (
              <>
              <Check aria-hidden="true" className="size-4" />
                Lưu
              </>
            ) : canAdd ? (
              <>
                <Plus aria-hidden="true" className="size-4" />
                Thêm
              </>
            ) : (
            <Plus aria-hidden="true" className="size-4" />
            )}
          </button>
          {editingIndex !== null ? (
            <button
              aria-label="Hủy sửa dấu hiệu"
              className="inline-flex size-8 items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-slate-50"
              onClick={handleCancelEdit}
              type="button"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          ) : null}
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

      {removeIndex !== null ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 px-4 py-6">
          <section
            aria-labelledby="framework-signal-remove-title"
            aria-modal="true"
            className="grid w-full max-w-sm gap-5 rounded-lg bg-white p-6 shadow-xl shadow-slate-950/20"
            role="dialog"
          >
            <div>
              <h2 className="text-lg font-black text-blue-950" id="framework-signal-remove-title">
                Xóa dấu hiệu
              </h2>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
                Dấu hiệu{' '}
                <span className="font-bold text-blue-950">
                  {signals[removeIndex]?.code}
                </span>{' '}
                sẽ bị xóa khỏi danh sách. Bạn có chắc chắn muốn tiếp tục?
              </p>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                className="inline-flex h-10 items-center justify-center rounded-lg border border-slate-200 px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                onClick={() => setRemoveIndex(null)}
                type="button"
              >
                Hủy
              </button>
              <button
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-sm font-bold text-white transition hover:bg-red-700"
                onClick={() => handleRemove(removeIndex)}
                type="button"
              >
                <Trash2 aria-hidden="true" className="size-4" />
                Xóa
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  )
}
