'use client'
import { useState } from 'react'
import { CheckCircle2, XCircle, Award, Download, RotateCcw } from 'lucide-react'
import { QuizQuestion } from '@/lib/data/quiz-builder'
import { AssessmentAttempt, Certificate, maybeIssueCertificate } from '@/lib/data/assessment-progress'
import { downloadCertificatePdf } from '@/lib/utils/certificate-pdf'

interface Props {
  questions: QuizQuestion[]
  answers: (number | null)[]
  attempt: AssessmentAttempt
  certificateTitle: string
  onRetry: () => void
}

export function ExamResults({ questions, answers, attempt, certificateTitle, onRetry }: Props) {
  const [recipientName, setRecipientName] = useState('')
  const [certificate, setCertificate] = useState<Certificate | null>(null)
  const [nameError, setNameError] = useState(false)

  const eligible = attempt.percent >= 85 // mirrors CERTIFICATE_THRESHOLD

  const handleClaimCertificate = () => {
    if (!recipientName.trim()) { setNameError(true); return }
    const cert = maybeIssueCertificate(attempt, recipientName.trim(), certificateTitle)
    if (cert) {
      setCertificate(cert)
      downloadCertificatePdf(cert)
    }
  }

  return (
    <div className="space-y-6">
      {/* Score summary */}
      <div className="text-center py-6">
        <p className={`text-5xl font-bold mb-2 ${attempt.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
          {attempt.percent}%
        </p>
        <p className="text-sm text-white/40">{attempt.score} / {attempt.total} correct</p>
        <p className={`text-xs mt-2 inline-block px-3 py-1 rounded-full border ${attempt.passed ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25' : 'text-rose-400 bg-rose-500/10 border-rose-500/25'}`}>
          {attempt.passed ? 'Passed' : 'Not Passed'}
        </p>
      </div>

      {/* Certificate claim */}
      {eligible && !certificate && (
        <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-5 text-center space-y-4">
          <Award className="w-8 h-8 mx-auto text-amber-400" />
          <p className="text-sm text-amber-300 font-medium">
            You scored high enough to earn a certificate!
          </p>
          <div className="max-w-xs mx-auto">
            <input
              type="text"
              placeholder="Enter your name for the certificate"
              value={recipientName}
              onChange={(e) => { setRecipientName(e.target.value); setNameError(false) }}
              className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm text-white/80 text-center focus:outline-none focus:border-amber-500/50"
            />
            {nameError && <p className="text-xs text-rose-400 mt-1">Please enter a name to continue.</p>}
          </div>
          <button
            onClick={handleClaimCertificate}
            className="inline-flex items-center gap-2 rounded-lg bg-amber-600 hover:bg-amber-500 px-6 py-2.5 text-sm font-semibold text-white transition-all"
          >
            <Download className="w-4 h-4" /> Claim & Download Certificate
          </button>
        </div>
      )}

      {certificate && (
        <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-5 text-center space-y-3">
          <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-400" />
          <p className="text-sm text-emerald-300">Certificate downloaded — check your downloads folder.</p>
          <button
            onClick={() => downloadCertificatePdf(certificate)}
            className="text-xs text-white/40 hover:text-white/70 transition-colors underline"
          >
            Download again
          </button>
        </div>
      )}

      {/* Answer review */}
      <div>
        <p className="text-xs text-white/25 uppercase tracking-wider mb-3 font-mono">Answer Review</p>
        <div className="space-y-3">
          {questions.map((q, i) => {
            const userAnswer = answers[i]
            const correct = userAnswer === q.correctIndex
            return (
              <div key={q.id} className={`rounded-lg border p-4 ${correct ? 'border-emerald-500/15 bg-emerald-500/5' : 'border-rose-500/15 bg-rose-500/5'}`}>
                <div className="flex items-start gap-2 mb-2">
                  {correct ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" /> : <XCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />}
                  <p className="text-xs text-white/70">{q.prompt}</p>
                </div>
                <p className="text-[11px] text-white/40 pl-6">
                  Your answer: <span className={correct ? 'text-emerald-400' : 'text-rose-400'}>{userAnswer !== null ? q.choices[userAnswer] : 'Not answered'}</span>
                  {!correct && <> · Correct: <span className="text-emerald-400">{q.choices[q.correctIndex]}</span></>}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      <button
        onClick={onRetry}
        className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 hover:border-white/20 px-6 py-2.5 text-sm text-white/60 hover:text-white transition-all"
      >
        <RotateCcw className="w-4 h-4" /> Try Again
      </button>
    </div>
  )
}
