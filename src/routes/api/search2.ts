import { VERSIONS, BOOKS } from '$lib/bibleData'
import { dev } from '$app/env'
import transliterate from 'unidecode'
import * as cheerio from 'cheerio'
import type { RequestHandler } from '@sveltejs/kit'

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

const deserializeHTML = ($: cheerio.CheerioAPI) => {
  return null
}

const removeElement = ($: cheerio.CheerioAPI, selectors: string | string[]) => {
  if (!Array.isArray(selectors)) selectors = [selectors]
  selectors.forEach((selector) => {
    $(selector).remove()
  })
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
  if (!ref || !version) return 400

  // pass pregenerated HTML to limit requests during development
  if (dev) {
    switch (version) {
      case 'NIV':
        return await getWebsiteHTML({
          customDevHTML: (await import('$lib/devHTML')).TEST_NIV
        })
      case 'ESV':
        return await getWebsiteHTML({
          customDevHTML: (await import('$lib/devHTML')).TEST_ESV
        })
      case 'MSG':
        return await getWebsiteHTML({
          customDevHTML: (await import('$lib/devHTML')).TEST_MSG
        })
      case 'VOICE':
        return await getWebsiteHTML({
          customDevHTML: (await import('$lib/devHTML')).TEST_VOICE
        })
      default:
        return await getWebsiteHTML({
          customDevHTML: `<html><body><h1>Ref not found</h1></body></html>`
        })
    }
  }

  // get website HTML for bible
  const baseurl = `https://www.biblegateway.com/passage/`
  return await getWebsiteHTML({
    baseurl,
    query: { search: ref, version },
    searchSelector: '.passage-col'
  })
}

export const get: RequestHandler = async ({ query }) => {
  const ref = query.get('ref')
  const version = query.get('version')
  const $ = await getBibleSite({ ref, version: VERSIONS.getId(version) })

  if (typeof $ === 'number')
    return generalHTTPError({
      status: $,
      message: ERROR_DICT?.[$],
      data: { ref, version: version }
    })

  removeElement($, [
    'sup.crossreference',
    'sup.footnote',
    'div.crossrefs',
    'div.footnotes',
    'a',
    'div.long-aside',
    'div.short-aside',
    'div.copyright-table'
  ])

  return {
    status: 200,
    body: transliterate($('.passage-text').html())
  }
}
