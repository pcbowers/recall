import { VERSIONS, BOOKS } from '$lib/bibleData'
import { dev } from '$app/env'
import * as cheerio from 'cheerio'
import type { RequestHandler } from '@sveltejs/kit'
import {
  filterHTML,
  insertSiblingIfNotExists,
  prependToNearest,
  removeAttribute,
  removeClasses,
  removeElements,
  replaceClass,
  replaceTag,
  unwrapElements,
  wrapEveryElement,
  deserializeHTML
} from '$lib/domHelpers'

const ERROR_DICT = {
  400: 'make sure you use a valid reference and version.',
  404: 'the reference or version does not exist.',
  408: 'Request timeout.',
  504: 'Gateway timeout.',
  500: 'Server error.'
}

const generalHTTPError = ({
  status = 400,
  message = '',
  data = undefined
}: {
  status?: number
  message?: string
  data?: { [key: string]: string | number }
}) => {
  return {
    status,
    body: {
      error: message || 'An unknown error occurred.',
      data: data
    }
  }
}

const generateQueryString = (query: { [key: string]: string }) => {
  let queryString = '?'
  for (const property in query) {
    queryString += `${encodeURIComponent(property)}=${encodeURIComponent(query[property])}&`
  }

  return queryString
}

const getWebsiteHTML = async ({
  baseurl = '',
  query = {},
  searchSelector = '*',
  customDevHTML = ''
}: {
  baseurl?: string
  query?: { [key: string]: string }
  searchSelector?: string
  customDevHTML?: string
}) => {
  let text = ''
  // check if custom HTML was passed for development
  if (customDevHTML) text = customDevHTML
  else {
    // error if no baseurl
    if (!baseurl) return 500

    // error if fails to fetch
    const res = await fetch(baseurl + generateQueryString(query))
    if (!res.ok) return res.status

    text = await res.text()
  }
  // error if search not found
  const $ = cheerio.load(text)
  if (!$(searchSelector).length) return 404

  // return cheerio
  return $
}

const getBibleSite = async ({ ref = '', version = '' }) => {
  // error if query params not passed
  if (!ref || (!dev && !VERSIONS.getId(version))) return 400

  // pass pregenerated HTML to limit requests during development
  if (dev) {
    switch (version) {
      case 'NIV':
      case 'niv':
        return await getWebsiteHTML({
          customDevHTML: (await import('$lib/devHTML')).TEST_NIV
        })
      case 'ESV':
      case 'esv':
        return await getWebsiteHTML({
          customDevHTML: (await import('$lib/devHTML')).TEST_ESV
        })
      case 'MSG':
      case 'msg':
        return await getWebsiteHTML({
          customDevHTML: (await import('$lib/devHTML')).TEST_MSG
        })
      case 'VOICE':
      case 'voice':
        return await getWebsiteHTML({
          customDevHTML: (await import('$lib/devHTML')).TEST_VOICE
        })
      case version.match(/^FETCH_WEB/)?.input:
      case version.match(/^fetch_web/)?.input:
        version = version.split('|')[1]
        break
      default:
        return await getWebsiteHTML({
          customDevHTML: `<html><body><h1>Ref not found</h1></body></html>`,
          searchSelector: '.passage-col'
        })
    }
  }

  version = VERSIONS.getId(version)

  // get website HTML for bible
  const baseurl = `https://www.biblegateway.com/passage/`
  return await getWebsiteHTML({
    baseurl,
    query: { search: ref, version },
    searchSelector: '.passage-col'
  })
}

const addStyle = (tag: string, attributes: Record<string, string>): string => {
  const predefinedStyles = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote']
  if (attributes?.class) return attributes.class
  if (predefinedStyles.includes(tag)) return tag
  return 'normal'
}

const addMarks = (
  tag: string,
  attributes: Record<string, string>,
  oldMarkDefs: Record<string, unknown>[]
): [string[], Record<string, unknown>[]] => {
  const predefinedMarks = ['strong', 'em', 'sup', 'underline', 'strike-through', 'br']
  const marks = []
  const newMarkDefs = []
  if (predefinedMarks.includes(tag)) marks.push(tag)
  if (attributes?.class) {
    const classes = attributes.class.split(' ')
    for (const className of classes) {
      marks.push(className)
      if (['versenum', 'chapternum'].includes(className)) continue
      if (oldMarkDefs.some((def) => def._key === className)) continue

      const [bookID, chapter, verse, , , toVerse] = className.split('-')
      newMarkDefs.push({
        _key: className,
        _type: 'reference',
        ref: `${BOOKS.getName(bookID) || bookID} ${chapter}:${verse}${
          toVerse ? `-${toVerse}` : ''
        }`,
        bookID,
        book: BOOKS.getName(bookID) || bookID,
        chapter: Number(chapter),
        verse: Number(verse),
        ...(Number(toVerse) && { toVerse: Number(toVerse) })
      })
    }
  }
  return [marks, newMarkDefs]
}

export const get: RequestHandler = async ({ query }) => {
  const ref = query.get('ref')
  const version = query.get('version')
  const $ = await getBibleSite({ ref, version })

  if (typeof $ === 'number')
    return generalHTTPError({
      status: $,
      message: ERROR_DICT?.[$],
      data: { ref, version: version }
    })

  // filter HTML by removing contents and replacing HTML with only the selected portion
  filterHTML($, '.passage-col')

  // remove uncesscary elements
  removeElements($, 'html', [
    'sup.crossreference',
    'sup.footnote',
    'div.crossrefs',
    'div.footnotes',
    'a:not(.bibleref)',
    'div.copyright-table',
    'div.dropdowns',
    'div.clearfix',
    'div.il-text',
    'div.passage-other-trans',
    'head'
  ])

  // remove unecessary classes
  removeClasses($, 'html', [/^text$/, /^chapter-/, /^first-line/, /^top/])

  // remove uncesscary attributes
  removeAttribute($, 'html', '[class=""]', 'class')
  removeAttribute($, 'html', '[style]', 'style')
  removeAttribute($, 'html', '[id]', 'id')

  // unwrap elements that are unecessary
  unwrapElements($, 'html', [
    'div.poetry',
    'span.indent-1',
    'span.indent-2',
    'span.indent-3',
    'span.indent-1-breaks',
    'span.indent-2-breaks',
    'span.indent-3-breaks',
    'div.dropdown-display',
    'div.dropdown-display-text',
    'div.text-html',
    'div.passage-content',
    'h1.passage-display',
    'div.list',
    'div.std-text',
    'div:not([class])',
    'div.long-aside>p',
    'div.short-aside>p',
    'a.bibleref'
  ])

  // insert missing verse labels
  insertSiblingIfNotExists($, '.chapternum', '.versenum', '<sup class="versenum">1&nbsp;</sup>')

  // place empty text inside of the nearest verse
  prependToNearest($, 'p', 'span', 3)

  // do the same with any new lines
  prependToNearest($, 'p', 'span', 'br')

  // make sure there are no text nodes within each verse
  wrapEveryElement($, 'html', 'span[class]:not(span[class="versenum"], span[class="chapternum"])')

  // replace class names with the ones desired
  replaceClass($, 'html', /^line$/, 'poetry')
  replaceClass($, 'html', /^left/, 'indent')
  replaceClass($, 'html', /^hang/, 'hang')

  // replace tag names with the ones desired
  replaceTag($, 'html', 'b', 'strong')
  replaceTag($, 'html', 'i', 'em')
  replaceTag($, 'html', 'sup.versenum', 'span')
  replaceTag($, 'html', 'div.long-aside', 'p')
  replaceTag($, 'html', 'div.short-aside', 'p')

  // replace verse tags by unwrapping and shuffling attriubtes down
  replaceTag($, 'html', 'span[class]:not(span[class="versenum"], span[class="chapternum"])', false)

  // make sure any remmant spans are unwrapped
  unwrapElements($, 'html', 'span:not([class])')

  // make contents of br equal to a new line
  $('br', 'html').text('\n')

  // deserialize passages
  const passages = $('.passage-text')
    .map((i) => {
      const passage = {
        ref: $('.bcv').eq(i).text(),
        refID: undefined,
        version: $('.translation').eq(i).text(),
        versionID: undefined,
        book: undefined,
        bookID: undefined,
        chapter: undefined,
        verse: undefined,
        toBook: undefined,
        toBookID: undefined,
        toChapter: undefined,
        toVerse: undefined,
        content: deserializeHTML($, '.passage-text', i, addStyle, addMarks)
      }

      const lastBlock = passage.content.length - 1
      const lastMarkDef = passage.content[lastBlock].markDefs.length - 1

      const { bookID: bID1, chapter: cID1, verse: vID1 } = passage.content[0].markDefs[0]

      const {
        bookID: bID2,
        chapter: cID2,
        verse: vID2,
        toVerse: tvID2
      } = passage.content[lastBlock].markDefs[lastMarkDef]

      passage.versionID = VERSIONS.getId(passage.version)
      passage.book = BOOKS.getName(bID1)
      passage.toBook = BOOKS.getName(bID2)
      passage.chapter = cID1
      passage.toChapter = cID2
      passage.verse = vID1
      passage.toVerse = tvID2 || vID2
      passage.refID = `${bID1}-${cID1}-${vID1}-${bID2}-${cID2}-${tvID2 || vID2}`

      return passage
    })
    .toArray()

  return {
    status: 200,
    // body: '<body>' + $.html() + '</body>'
    body: {
      searchRef: ref,
      searchVersion: version,
      passages
    }
  }
}
