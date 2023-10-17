// find color in palette by the color value itself
// (note that hex/rgb/rgba matters -- it's considered to be different colors)
export const findColorInPalette = (color, palette) => {
  if (color === palette.gray[0]) return ['gray', 0]
  if (color === palette.gray[palette.gray.length - 1]) return ['gray', palette.gray.length]
  for (const name in palette) {
    const level = palette[name].indexOf(color)
    if (level !== -1) return [name, level]
  }
  return [] // color not found in palette, return empty array
}

function getPaletteMeta (palette, { skipLowest = 2, skipHighest = 1 } = {}) {
  const res = {}
  res.low = skipLowest // darkest colorful color
  res.high = Object.values(palette)[0].length - 1 - skipHighest // lightest colorful color
  res.lowest = 0 // black
  res.highest = Object.values(palette)[0].length - 1 // white
  res.middle = Math.floor(res.highest / 2) + 1 // first light color
  return res
}

export class TheColor {
  constructor (name, level, palette, { skipLowest = 2, skipHighest = 1 } = {}) {
    if (!palette?.[name]?.[level]) throw Error(`Color ${name} level ${level} not found in palette ${palette}`)
    Object.assign(this, {
      name,
      level,
      palette,
      _skipLowest: skipLowest,
      _skipHighest: skipHighest,
      ...getPaletteMeta(palette, { skipLowest, skipHighest })
    })
  }

  clone (name, level, palette, { skipLowest, skipHighest } = {}) {
    return new TheColor(
      name ?? this.name,
      level ?? this.level,
      palette ?? this.palette,
      {
        skipLowest: skipLowest ?? this._skipLowest,
        skipHighest: skipHighest ?? this._skipHighest
      }
    )
  }

  toString () { return this.palette[this.name][this.level] }
  isEqual (other) { return this.name === other.name && this.level === other.level }
  isDark () { return this.level < this.middle }
  isLight () { return !this.isDark() }
  highContrast () { return this.clone(this.name, this.isDark() ? this.high : this.low) }
  stronger (offset = 1) { return this.dimmer(-offset) }
  dimmer (offset = 1) {
    if (this.isLight()) offset = -offset
    let level = this.level + offset
    level = Math.min(this.highest, Math.max(this.lowest, level))
    return this.clone(this.name, level)
  }
}

/* eslint-disable dot-notation, no-multi-spaces */
// generate meaningful colors from palette
export default function generateColors ({ existing = {}, palette, skipLowest = 2, skipHighest = 1 } = {}) {
  if (!palette) throw Error('palette is required')
  const Color = (name, level) => new TheColor(name, level, palette, { skipLowest, skipHighest })
  const { low, middle, high } = getPaletteMeta(palette, { skipLowest, skipHighest })

  // TODO: go through each color in `existing` and if it's not instanceof TheColor,
  //       then `findColorInPalette` and convert it to TheColor
  const C = { ...existing }

  // base colors
  C['bg']           ??= Color('coolGray', high)
  C['bg-primary']   ??= Color('blue', middle - 1)
  C['bg-secondary'] ??= Color('gray', low)
  C['bg-error']     ??= Color('red', middle - 1)
  C['bg-success']   ??= Color('green', middle - 1)
  C['bg-warning']   ??= Color('yellow', middle - 1)
  C['bg-info']      ??= Color('cyan', middle - 1)
  C['bg-attention'] ??= Color('orange', middle - 1)
  C['bg-special']   ??= Color('purple', middle - 1)

  // all other colors are generated from the base colors

  // bg
  C['bg-dim']     ??= C['bg'].dimmer(1)
  C['bg-strong']  ??= C['bg'].stronger(1)
  C['bg-primary-inverse'] ??= C['bg-primary'].highContrast()
  C['bg-secondary-inverse'] ??= C['bg-secondary'].highContrast()
  C['bg-error-inverse'] ??= C['bg-error'].highContrast()
  C['bg-success-inverse'] ??= C['bg-success'].highContrast()
  C['bg-warning-inverse'] ??= C['bg-warning'].highContrast()
  C['bg-info-inverse'] ??= C['bg-info'].highContrast()
  C['bg-attention-inverse'] ??= C['bg-attention'].highContrast()
  C['bg-special-inverse'] ??= C['bg-special'].highContrast()

  // text
  C['text']             ??= C['bg-secondary']
  C['text-description'] ??= C['text'].dimmer(3)
  C['text-placeholder'] ??= C['text'].dimmer(5)
  C['text-primary']     ??= C['bg-primary']
  C['text-secondary']   ??= C['bg-secondary']
  C['text-error']       ??= C['bg-error']
  C['text-success']     ??= C['bg-success']
  C['text-warning']     ??= C['bg-warning']
  C['text-info']        ??= C['bg-info']
  C['text-attention']   ??= C['bg-attention']
  C['text-special']     ??= C['bg-special']

  // text on different backgrounds
  C['text-on-primary']    ??= C['bg-primary'].highContrast()
  C['text-on-secondary']  ??= C['bg-secondary'].highContrast()
  C['text-on-error']      ??= C['bg-error'].highContrast()
  C['text-on-success']    ??= C['bg-success'].highContrast()
  C['text-on-warning']    ??= C['bg-warning'].highContrast()
  C['text-on-info']       ??= C['bg-info'].highContrast()
  C['text-on-attention']  ??= C['bg-attention'].highContrast()
  C['text-on-special']    ??= C['bg-special'].highContrast()

  // border
  C['border']           ??= C['bg'].dimmer(2)
  C['border-primary']   ??= C['bg-primary']
  C['border-secondary'] ??= C['bg-secondary']
  C['border-error']     ??= C['bg-error']
  C['border-success']   ??= C['bg-success']
  C['border-warning']   ??= C['bg-warning']
  C['border-info']      ??= C['bg-info']
  C['border-attention'] ??= C['bg-attention']
  C['border-special']   ??= C['bg-special']

  return C
} /* eslint-enable dot-notation, no-multi-spaces */

export function rgba (color, alpha) {
  if (typeof alpha !== 'number' || alpha < 0 || alpha > 1) {
    throw new Error('Invalid alpha value. It should be between 0 and 1.')
  }

  // Convert hex to RGB
  const hexToRgb = (hex) => {
    if (hex.startsWith('#')) hex = hex.slice(1)
    const bigint = parseInt(hex, 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255
    return [r, g, b]
  }

  // Extract RGB values from RGB or RGBA string
  const extractRGB = (str) => {
    const match = str.match(/(\d+\.?\d*|\.\d+)/g) // improved regex to match decimals
    if (!match) return []
    return match.map(Number)
  }

  if (color.startsWith('#')) {
    const [r, g, b] = hexToRgb(color)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  } else if (color.startsWith('rgb')) {
    const values = extractRGB(color)
    if (values.length === 3 || values.length === 4) {
      return `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${alpha})`
    }
  }
  throw new Error('Invalid color format. Supported formats are hex, rgb, and rgba.')
}
