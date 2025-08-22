"use client"

import type React from "react"
import { useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

const penyakitInfo = [
  {
    title: "Healthy",
    desc: "Kulit kucing dalam kondisi sehat dan normal",
    color: "bg-green-900 border-green-700 text-green-200",
  },
  {
    title: "Flea Allergy",
    desc: "Alergi kutu yang menyebabkan gatal dan iritasi kulit",
    color: "bg-yellow-900 border-yellow-700 text-yellow-200",
  },
  {
    title: "Ringworm",
    desc: "Infeksi jamur yang menyebabkan bercak melingkar pada kulit",
    color: "bg-red-900 border-red-700 text-red-200",
  },
  {
    title: "Scabies",
    desc: "Infeksi tungau yang menyebabkan gatal parah dan kerontokan bulu",
    color: "bg-purple-900 border-purple-700 text-purple-200",
  },
]

export default function Page() {
  const [image, setImage] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [result, setResult] = useState<{ prediction: string; confidence: number } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Silakan pilih file gambar yang valid")
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Ukuran file harus kurang dari 5MB")
        return
      }
      setImage(file)
      setPreview(URL.createObjectURL(file))
      setError(null)
      setResult(null)
    }
  }

  const handleSubmit = async () => {
    if (!image) {
      setError("Silakan pilih gambar terlebih dahulu!")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append("file", image)
      const response = await axios.post("https://oqi121-klasifikasi-penyakit-kucing.hf.space/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 30000,
      })
      setResult(response.data)
    } catch (err: any) {
      if (err.code === "ECONNABORTED") {
        setError("Waktu permintaan habis. Silakan coba lagi.")
      } else if (err.response?.status === 500) {
        setError("Error server. Silakan coba lagi nanti.")
      } else {
        setError("Gagal mengklasifkasikan gambar. Periksa koneksi internet dan coba lagi.")
      }
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setImage(null)
    setPreview(null)
    setResult(null)
    setError(null)
  }

  const getResultColor = (prediction: string) => {
    const p = prediction.toLowerCase().trim()
    if (p.includes("health")) return "bg-green-900 text-green-200"
    if (p.includes("flea")) return "bg-yellow-900 text-yellow-200"
    if (p.includes("ringworm")) return "bg-red-900 text-red-200"
    if (p.includes("scabies")) return "bg-purple-900 text-purple-200"
    return "bg-gray-900 text-gray-200"
  }

  const getResultBorderColor = (prediction: string) => {
    const p = prediction.toLowerCase().trim()
    if (p.includes("healthy")) return "border-green-700 bg-green-950"
    if (p.includes("flea")) return "border-yellow-700 bg-yellow-950"
    if (p.includes("ringworm")) return "border-red-700 bg-red-950"
    if (p.includes("scabies")) return "border-purple-700 bg-purple-950"
    return "border-gray-700 bg-gray-950"
  }

  const getResultDescription = (prediction: string) => {
    if (!prediction) return "Belum ada hasil klasifikasi."
    const p = prediction.toLowerCase().trim()
    if (p.includes("health"))
      return "Kulit kucing dalam kondisi sehat dan normal. Tidak ditemukan tanda-tanda penyakit kulit yang signifikan."
    if (p.includes("flea"))
      return "Terdeteksi alergi kutu yang menyebabkan gatal dan iritasi kulit. Disarankan untuk membersihkan kutu dan berkonsultasi dengan dokter hewan."
    if (p.includes("ringworm"))
      return "Terdeteksi infeksi jamur (kurap) yang menyebabkan bercak melingkar pada kulit. Segera konsultasikan dengan dokter hewan untuk pengobatan antijamur."
    if (p.includes("scabies"))
      return "Terdeteksi infeksi tungau (kudis) yang menyebabkan gatal parah dan kerontokan bulu. Memerlukan perawatan medis segera dari dokter hewan."
    return "Hasil klasifikasi tidak dapat dikategorikan dengan pasti. Disarankan untuk berkonsultasi dengan dokter hewan untuk pemeriksaan lebih lanjut."
  }

  return (
    <div className="min-h-screen bg-gray-950 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">🐱 MeowScan</h1>
          <p className="text-gray-400">Deteksi penyakit kulit kucing menggunakan model AI YOLOv11</p>
        </div>

        {/* Info Penyakit */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {penyakitInfo.map((item) => (
            <Card key={item.title} className={`${item.color} border-2`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Upload Section */}
        <Card className="mb-6 bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Upload Gambar</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleChange}
              className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-emerald-900 file:text-emerald-200 hover:file:bg-emerald-800"
            />
            
            {preview && (
              <div className="space-y-3">
                <div className="relative group">
                  <img
                    src={preview || "/placeholder.svg"}
                    alt="Preview"
                    className="max-w-full max-h-64 mx-auto rounded-lg border border-gray-700 shadow-lg transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Label kecil di pojok kiri atas */}
                  <span className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    Preview
                  </span>
                </div>
                <Button onClick={resetForm} className="w-full bg-rose-600 hover:bg-rose-900 text-white">
                  🗑 Hapus Gambar
                </Button>
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Button onClick={handleSubmit} disabled={!image || loading} className="w-full ">
              {loading ? "Menganalisis..." : "Klasifikasi Gambar"}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {result && (
          <Card className="border border-gray-700 bg-gray-900">
            <CardHeader className="bg-gray-800">
              <CardTitle className="text-center text-xl text-gray-100">🎯 Hasil Klasifikasi</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Prediction */}
              <div className="text-center">
                <span className="text-sm text-gray-400 block mb-2">Diagnosis:</span>
                <Badge className={`text-xl px-6 py-3 font-bold ${getResultColor(result.prediction)}`}>
                  {result.prediction}
                </Badge>
              </div>
              {/* Confidence */}
              <div className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-gray-100">Tingkat Keyakinan:</span>
                  <span
                    className={`text-2xl font-bold ${
                      result.confidence >= 0.8
                        ? "text-emerald-400"
                        : result.confidence >= 0.6
                          ? "text-cyan-400"
                          : "text-rose-400"
                    }`}
                  >
                    {(result.confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                  <div
                    className={`h-4 transition-all duration-1000 ${
                      result.confidence >= 0.8
                        ? "bg-gradient-to-r from-emerald-600 to-emerald-500"
                        : result.confidence >= 0.6
                          ? "bg-gradient-to-r from-cyan-600 to-cyan-500"
                          : "bg-gradient-to-r from-rose-600 to-rose-500"
                    }`}
                    style={{ width: `${result.confidence * 100}%` }}
                  />
                </div>
              </div>
              {/* Description */}
              <div className={`rounded-lg p-4 border ${getResultBorderColor(result.prediction)}`}>
                <h3 className="font-bold mb-2 text-gray-100">Informasi Penyakit:</h3>
                <p className="text-sm leading-relaxed text-gray-300">{getResultDescription(result.prediction)}</p>
              </div>
              {/* Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={resetForm}
                  variant="default"
                  className="flex-1 bg-black border-gray-600 text-gray-200 hover:bg-gray-700"
                >
                  🔄 Klasifikasi Lagi
                </Button>
                <Button
                  onClick={() => window.print()}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  📄 Cetak Hasil
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
