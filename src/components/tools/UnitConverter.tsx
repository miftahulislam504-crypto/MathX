'use client'
import { useState, useMemo } from 'react'
import { Ruler } from 'lucide-react'

type Category = 'length' | 'mass' | 'area' | 'temperature'

// Ratio-based conversions: all factors are "value in base unit per 1 of this unit".
// Verified against internationally standardized definitions (SI, imperial).
const CONVERSION_TABLES: Record<Exclude<Category, 'temperature'>, Record<string, number>> = {
  length: {
    Meter: 1, Kilometer: 1000, Centimeter: 0.01, Millimeter: 0.001,
    Mile: 1609.344, Yard: 0.9144, Foot: 0.3048, Inch: 0.0254,
  },
  mass: {
    Kilogram: 1, Gram: 0.001, Milligram: 0.000001,
    Pound: 0.45359237, Ounce: 0.0283495231, Tonne: 1000,
  },
  area: {
    'Square Meter': 1, 'Square Kilometer': 1000000, 'Square Foot': 0.09290304,
    Acre: 4046.8564224, Hectare: 10000,
  },
}

const TEMP_UNITS = ['Celsius', 'Fahrenheit', 'Kelvin']

function convertTemperature(value: number, from: string, to: string): number {
  // Normalize to Celsius first, then convert to target
  let celsius: number
  if (from === 'Celsius') celsius = value
  else if (from === 'Fahrenheit') celsius = (value - 32) * (5 / 9)
  else celsius = value - 273.15 // Kelvin

  if (to === 'Celsius') return celsius
  if (to === 'Fahrenheit') return celsius * (9 / 5) + 32
  return celsius + 273.15 // Kelvin
}

export function UnitConverter() {
  const [category, setCategory] = useState<Category>('length')
  const [value, setValue] = useState('1')
  const [fromUnit, setFromUnit] = useState('Meter')
  const [toUnit, setToUnit] = useState('Foot')

  const units = category === 'temperature' ? TEMP_UNITS : Object.keys(CONVERSION_TABLES[category])

  const result = useMemo(() => {
    const num = parseFloat(value)
    if (isNaN(num)) return null
    if (category === 'temperature') {
      return convertTemperature(num, fromUnit, toUnit)
    }
    const table = CONVERSION_TABLES[category]
    const baseValue = num * (table[fromUnit] ?? 1)
    return baseValue / (table[toUnit] ?? 1)
  }, [value, fromUnit, toUnit, category])

  const changeCategory = (c: Category) => {
    setCategory(c)
    const newUnits = c === 'temperature' ? TEMP_UNITS : Object.keys(CONVERSION_TABLES[c])
    setFromUnit(newUnits[0])
    setToUnit(newUnits[1] ?? newUnits[0])
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {(['length', 'mass', 'area', 'temperature'] as Category[]).map((c) => (
          <button
            key={c}
            onClick={() => changeCategory(c)}
            className={`text-xs px-3 py-1.5 rounded-full border capitalize transition-all ${
              category === c ? 'bg-orange-500/15 border-orange-500/40 text-orange-300' : 'border-white/8 text-white/40 hover:text-white/70'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white font-mono text-lg text-center focus:outline-none focus:border-orange-500/50"
      />

      <div className="grid grid-cols-2 gap-3 items-center">
        <select
          value={fromUnit}
          onChange={(e) => setFromUnit(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50"
        >
          {units.map((u) => <option key={u} value={u} className="bg-zinc-900">{u}</option>)}
        </select>
        <select
          value={toUnit}
          onChange={(e) => setToUnit(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-orange-500/50"
        >
          {units.map((u) => <option key={u} value={u} className="bg-zinc-900">{u}</option>)}
        </select>
      </div>

      {result !== null && (
        <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-6 text-center flex items-center justify-center gap-3">
          <Ruler className="w-5 h-5 text-orange-400" />
          <p className="text-2xl font-mono text-white/90">
            {value} {fromUnit} = <span className="text-orange-400">{result.toFixed(6).replace(/\.?0+$/, '')}</span> {toUnit}
          </p>
        </div>
      )}
    </div>
  )
}
