'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Award, ChevronLeft, Download } from 'lucide-react'
import { useLanguage, t } from '@/lib/i18n/LanguageContext'
import { getCertificates, Certificate } from '@/lib/data/assessment-progress'
import { downloadCertificatePdf } from '@/lib/utils/certificate-pdf'

export default function CertificatesPage() {
  const { tt } = useLanguage()
  const [certificates, setCertificates] = useState<Certificate[]>([])

  useEffect(() => {
    setCertificates(getCertificates())
  }, [])

  return (
    <main className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/assessment"
          className="inline-flex items-center gap-1.5 text-xs text-white/30 hover:text-white/60 transition-colors mb-6 font-mono"
        >
          <ChevronLeft className="w-3.5 h-3.5" /> {tt(t.assessment.title)}
        </Link>

        <div className="mb-8">
          <p className="text-amber-400 text-sm font-mono mb-2">// Certificates</p>
          <h1 className="text-3xl font-bold text-white mb-2">Your Certificates</h1>
          <p className="text-white/40 text-sm">
            Earned by scoring 85% or higher on any Assessment System exam.
          </p>
        </div>

        {certificates.length === 0 ? (
          <div className="text-center py-16 text-white/20">
            <Award className="w-10 h-10 mx-auto mb-4" />
            <p className="text-sm">No certificates earned yet — pass an assessment with 85%+ to earn one.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="rounded-xl border border-amber-500/15 bg-amber-500/5 p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Award className="w-8 h-8 text-amber-400 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white/85 truncate">{cert.title}</p>
                    <p className="text-xs text-white/40">
                      {cert.recipientName} · {cert.percent}% · {new Date(cert.dateIssued).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => downloadCertificatePdf(cert)}
                  className="shrink-0 flex items-center gap-1.5 rounded-lg border border-amber-500/25 hover:bg-amber-500/10 px-3 py-2 text-xs text-amber-300 transition-all"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
