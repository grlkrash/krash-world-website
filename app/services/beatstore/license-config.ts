export type LicenseId = "mp3" | "wav" | "stems" | "unlimited"

export interface LicenseCaps {
  maxCopies: number | null
  maxAudioStreams: number | null
  maxMusicVideos: number | null
  maxRadioStations: number | null
  allowsForProfitLivePerformances: boolean
}

export interface LicenseRule {
  id: LicenseId
  name: string
  fileFormat: string
  caps: LicenseCaps
  flatPrice?: number
}

export interface LicenseOption {
  id: LicenseId
  name: string
  price: number
  fileFormat: string
  usage: string[]
}

export const LICENSE_TERMS_VERSION = "2026-02-18"
export const LICENSE_DISPLAY_ORDER: LicenseId[] = ["mp3", "wav", "stems", "unlimited"]

const MP3_PRICING_BY_TIER: Record<number, number> = {
  1: 60,
  2: 45,
  3: 30,
}

export const LICENSE_RULES: Record<LicenseId, LicenseRule> = {
  mp3: {
    id: "mp3",
    name: "MP3 Lease",
    fileFormat: "MP3",
    caps: {
      maxCopies: 2000,
      maxAudioStreams: 250000,
      maxMusicVideos: 1,
      maxRadioStations: 2,
      allowsForProfitLivePerformances: true,
    },
  },
  wav: {
    id: "wav",
    name: "WAV Lease",
    fileFormat: "MP3 + WAV",
    flatPrice: 75,
    caps: {
      maxCopies: 3000,
      maxAudioStreams: 500000,
      maxMusicVideos: 1,
      maxRadioStations: 2,
      allowsForProfitLivePerformances: true,
    },
  },
  stems: {
    id: "stems",
    name: "Stems Lease",
    fileFormat: "MP3 + WAV + Stems",
    flatPrice: 120,
    caps: {
      maxCopies: 10000,
      maxAudioStreams: 1000000,
      maxMusicVideos: 1,
      maxRadioStations: 2,
      allowsForProfitLivePerformances: true,
    },
  },
  unlimited: {
    id: "unlimited",
    name: "Unlimited Lease",
    fileFormat: "MP3 + WAV + Stems",
    flatPrice: 200,
    caps: {
      maxCopies: null,
      maxAudioStreams: null,
      maxMusicVideos: 1,
      maxRadioStations: null,
      allowsForProfitLivePerformances: true,
    },
  },
}

export function getMp3LeasePrice(input: { tier?: number }) {
  const tier = input.tier ?? 3
  return MP3_PRICING_BY_TIER[tier] ?? MP3_PRICING_BY_TIER[3]
}

export function getLicensePrice(input: { licenseId: LicenseId; tier?: number }) {
  if (input.licenseId === "mp3") return getMp3LeasePrice({ tier: input.tier })
  const rule = LICENSE_RULES[input.licenseId]
  return rule.flatPrice ?? getMp3LeasePrice({ tier: input.tier })
}

export function getLicenseRule(input: { licenseId: LicenseId }) {
  return LICENSE_RULES[input.licenseId]
}

export function getAvailableLicenseIds(input: { includesWav?: boolean; includesStems?: boolean }) {
  const hasWav = Boolean(input.includesWav)
  const hasStems = Boolean(input.includesStems)

  const availableIds: LicenseId[] = ["mp3"]
  if (hasWav) availableIds.push("wav")
  if (hasStems) availableIds.push("stems")
  if (hasWav && hasStems) availableIds.push("unlimited")

  return availableIds
}

function formatLimit(input: { value: number | null; noun: string; isStream?: boolean }) {
  if (input.value === null) return `Unlimited ${input.noun}`
  const formatted = input.value.toLocaleString("en-US")
  if (input.isStream) return `${formatted} ${input.noun}`
  return `Up to ${formatted} ${input.noun}`
}

function getUsageFromCaps(input: { caps: LicenseCaps }) {
  const { caps } = input
  const usage = [
    formatLimit({ value: caps.maxCopies, noun: "copies" }),
    formatLimit({ value: caps.maxAudioStreams, noun: "audio streams", isStream: true }),
    caps.maxMusicVideos === null ? "Unlimited music videos" : `${caps.maxMusicVideos} music video`,
    caps.maxRadioStations === null ? "Unlimited radio stations" : `Radio rights (${caps.maxRadioStations} stations)`,
  ]
  if (caps.allowsForProfitLivePerformances) usage.push("For-profit live performances")
  return usage
}

export function getLicenseUsageText(input: { licenseId: LicenseId }) {
  const rule = getLicenseRule({ licenseId: input.licenseId })
  return getUsageFromCaps({ caps: rule.caps })
}

export function getAvailableLicenseOptions(input: { includesWav?: boolean; includesStems?: boolean; tier?: number }) {
  const ids = getAvailableLicenseIds({
    includesWav: input.includesWav,
    includesStems: input.includesStems,
  })

  return ids.map((licenseId) => {
    const rule = getLicenseRule({ licenseId })
    return {
      id: rule.id,
      name: rule.name,
      price: getLicensePrice({ licenseId: rule.id, tier: input.tier }),
      fileFormat: rule.fileFormat,
      usage: getUsageFromCaps({ caps: rule.caps }),
    }
  })
}
