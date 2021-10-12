import type { PTBlock, PTCustomBlock } from '@portabletext/svelte'

export interface Search {
  searchRef: string
  searchVersion: string
  passages: {
    ref: string
    refID: string
    version: string
    versionID: string
    book: string
    chapter: number
    verse: number
    toBook: string
    toChapter: number
    toVerse: number
    content: (PTBlock | PTCustomBlock)[]
  }[]
}
