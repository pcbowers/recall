import { VERSIONS, BOOKS } from '../_data'
import { dev } from '$app/env'
import unidecode from 'unidecode'
import * as cheerio from 'cheerio'

const BASE_URL = `https://www.biblegateway.com/passage/?`

const transliterate = (str: string) => {
  return unidecode(str.replace(/¶/g, '').replace(/ +/g, ' ')).trim() as string
}

const createError = ({
  status = 400,
  message = 'An unknown error occurred.',
  data = undefined
}: {
  status?: number
  message?: string
  data?: unknown
}) => {
  return {
    status,
    body: {
      error: message,
      data: data
    }
  }
}

const getData = async (ref, version) => {
  ref = encodeURIComponent(ref)
  version = encodeURIComponent(version)
  if (dev) {
    switch (version) {
      case 'NIV':
        return (await import('./_test')).TEST_NIV
      case 'ESV':
        return (await import('./_test')).TEST_ESV
      case 'MSG':
        return (await import('./_test')).TEST_MSG
      case 'VOICE':
        return (await import('./_test')).TEST_VOICE
      default:
        if (ref === 'FAIL_REFERENCE') return `<html><body><h1>Ref not found</h1></body></html>`
        return 404
    }
  }

  const url = `${BASE_URL}?search=${ref}&version=${version}`
  const res = await fetch(url)

  if (!res.ok) return res.status
  return await res.text()
}

const sanitizeForVerses = ($: cheerio.CheerioAPI, passage: cheerio.Element) => {
  const psg = $('.passage-content', passage)

  // unwrap everything but bold, italics, verses, and paragraphs
  $(':not(span[class*="-"][class^="text"], br, p, i, b)', psg).contents().unwrap()

  // remove comments
  psg.html(psg.html().replace(/<!--.*?-->/g, ''))

  // remove empty fields
  $('*:not(br)', psg).each((id, el) => {
    $(el).removeClass('text')
    if ($(el).text() === '') $(el).remove()
  })

  // remove all attributes, sanitize classes
  $('*:not(br, span)', psg).each((id, el) => {
    const classes = ($(el).attr('class') || '')
      .split(' ')
      .filter((cls) => /^(left|line|hang)/.test(cls))
      .map((cls) => {
        if (cls.includes('line')) return 'poetry'
        if (cls.includes('left')) return 'indent'
        if (cls.includes('hang')) return 'hang'
      })
      .join(' ')

    $(el).removeAttr(Object.keys($(el).attr()).join(' '))

    if (classes) $(el).attr('class', classes)
  })
}

const sanitizeForPassage = ($: cheerio.CheerioAPI, passage: cheerio.Element) => {
  const psg = $('.passage-content', passage)

  // remove spans
  $('span', psg).contents().unwrap()

  // add spaces
  psg.html(psg.html().replace(/></g, '> <'))
}

const extractVerses = ($: cheerio.CheerioAPI, passage: cheerio.Element) => {
  const psg = $('.passage-content', passage)
  return $('span', psg)
    .map((id, el) => {
      const refID = $(el).attr('class')
      const [bookID, chapter, verse, , , toVerse] = refID.split('-')
      const text = $(el).text()
      let textFormatted = $(el).html()

      if ($(`[class="${refID}"]`, psg).length > 1) {
        if ($(`[class="${refID}"]`, psg).last().text() !== $(el).text()) {
          if ($(el).next('br').length) textFormatted += ' <br>'
          else textFormatted += ' <br><br>'
        }
      }

      return {
        refID,
        reference: `${BOOKS.getName(bookID) || bookID} ${chapter}:${verse}${
          toVerse ? `-${toVerse}` : ``
        }`,
        bookID,
        book: BOOKS.getName(bookID) || bookID,
        chapter: Number(chapter),
        verse: Number(verse),
        toVerse: Number(toVerse) || undefined,
        textFormatted: transliterate(textFormatted),
        text: transliterate(text)
      }
    })
    .toArray()
    .reduce(
      (acc, verse) => {
        if (acc.length && acc[acc.length - 1].refID === verse.refID) {
          acc[acc.length - 1].text += ` ${verse.text}`
          acc[acc.length - 1].textFormatted += verse.textFormatted
        } else acc.push(verse)
        return acc
      },
      [] as {
        refID: string
        reference: string
        bookID: string
        book: string
        chapter: number
        verse: number
        toVerse: number
        textFormatted: string
        text: string
      }[]
    )
}

const extractRefID = (
  verses: {
    refID: string
    reference: string
    bookID: string
    book: string
    chapter: number
    verse: number
    toVerse: number
    textFormatted: string
    text: string
  }[]
) => {
  const firstVerse = verses[0]
  const lastVerse = verses[verses.length - 1]
  const refID = `${firstVerse.bookID}-${firstVerse.chapter}-${
    firstVerse.toVerse || firstVerse.verse
  }`
  if (verses.length - 1 !== 0)
    return `${refID}-${lastVerse.bookID}-${lastVerse.chapter}-${
      lastVerse.toVerse || lastVerse.verse
    }`

  return refID
}

const extractPassage = ($: cheerio.CheerioAPI, passage: cheerio.Element) => {
  const psg = $(passage)

  sanitizeForVerses($, passage)

  // const verses = $('span', psg).length
  const verses = extractVerses($, passage)

  sanitizeForPassage($, passage)

  return {
    refID: extractRefID(verses),
    ref: transliterate($('.bcv .dropdown-display-text', psg).text()),
    versionID: transliterate(psg.data('translation') as string),
    version: transliterate($('.translation .dropdown-display-text', psg).text()),
    passageFormatted: transliterate($('.passage-content', psg).html()),
    passage: transliterate($('.passage-content', psg).text()),
    verses
  }
}

export async function get({ query }) {
  const ref = query.get('ref') || undefined
  const version = VERSIONS.getId(query.get('version'))

  // error if ref or version is not specified
  if (!ref || !version)
    return createError({
      message: 'Please include a reference and a version.',
      data: { ref, version }
    })

  const text = await getData(ref, version)

  // error if page is not loaded
  if (typeof text === 'number')
    return createError({
      status: text,
      message: 'fetch failed. Bad internet?',
      data: { ref, version }
    })

  const $ = cheerio.load(text)

  // error if reference is invalid
  if (!$('.passage-col').length)
    return createError({
      status: 404,
      message: 'invalid reference.',
      data: { ref, version }
    })

  $(`
    sup.crossreference,
    sup.footnote,
    div.crossrefs,
    div.footnotes,
    h3,
    sup.versenum,
    span.chapternum,
    a,
    div.long-aside,
    div.short-aside,
    div.copyright-table
  `).remove()

  const passages = $('.passage-col')
    .map((id, el) => {
      return extractPassage($, el)
    })
    .toArray()

  return {
    // body: transliterate(
    //   `<html>${passages[0].passage}${passages[1].passage}${passages[2].passage}${passages[3].passage}</html>`
    // )
    body: {
      searchRef: ref,
      searchVersion: version,
      passages
    }
  }
}
