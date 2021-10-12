import type { CheerioAPI } from 'cheerio'
import transliterate from 'unidecode'

export const filterHTML = ($: CheerioAPI, selector: string) => {
  $('html').html(
    [
      '<body>',
      transliterate(
        $(selector)
          .map((i, el) => $(el).html())
          .toArray()
          .join('')
      ),
      '</body>'
    ]
      .join('')
      .replace(/<!--.*?-->/g, '')
      .replace(/\n/g, '')
  )
}

export const replaceTag = (
  $: CheerioAPI,
  filterSelector: string,
  oldTag: string,
  newTag: string | false,
  keepProps = true
) => {
  if (newTag) {
    $(oldTag, filterSelector).each((i, el) => {
      const newEl = $(`<${newTag}>`)

      if (keepProps)
        for (const attribute in $(el).attr()) {
          newEl.attr(attribute, $(el).attr(attribute))
        }

      $(el).contents().unwrap().wrap(newEl[0])
    })
  } else {
    $(oldTag, filterSelector)
      .contents()
      .each((i, el) => {
        if (keepProps)
          for (const attribute in $(el).parent().attr()) {
            $(el).attr(
              attribute,
              [
                ...($(el).attr(attribute) || '').split(' '),
                ...($(el).parent().attr(attribute) || '').split(' ')
              ]
                .join(' ')
                .trim()
            )
          }
      })
      .unwrap()
  }
}

export const replaceClass = (
  $: CheerioAPI,
  filterSelector: string,
  oldClass: RegExp,
  newClass: string
) => {
  $('*', filterSelector)
    .filter((i, el) =>
      ($(el).attr('class') || '').split(' ').some((curClass) => curClass.match(oldClass))
    )

    .attr('class', (i, classNames) => {
      return [
        newClass,
        ...(classNames || '').split(' ').filter((curClass) => !curClass.match(oldClass))
      ].join(' ')
    })
}

export const removeElements = (
  $: CheerioAPI,
  filterSelector: string,
  selectors: string | string[]
) => {
  if (!Array.isArray(selectors)) selectors = [selectors]

  selectors.forEach((selector) => {
    $(selector, filterSelector).remove()
  })
}

export const unwrapElements = (
  $: CheerioAPI,
  filterSelector: string,
  selectors: string | string[]
) => {
  if (!Array.isArray(selectors)) selectors = [selectors]

  selectors.forEach((selector) => {
    $(selector, filterSelector).contents().unwrap()
  })
}

export const removeClasses = (
  $: CheerioAPI,
  filterSelector: string,
  classes: RegExp | RegExp[]
) => {
  if (!Array.isArray(classes)) classes = [classes]

  classes.forEach((className) => {
    $('*', filterSelector).removeClass((i, classNames) => {
      return classNames
        .split(' ')
        .filter((curClass) => curClass.match(className))
        .join(' ')
    })
  })
}

export const removeAttribute = (
  $: CheerioAPI,
  filterSelector: string,
  selector: string,
  attribute: string
) => {
  $(selector, filterSelector).removeAttr(attribute)
}

export const wrapEveryElement = (
  $: CheerioAPI,
  filterSelector: string,
  parentSelector: string,
  wrapper = 'span'
) => {
  $(parentSelector, filterSelector)
    .contents()
    .each((i, el) => {
      if (el.nodeType === 3) {
        if (
          el.previousSibling &&
          $(el.previousSibling).prop('tagName') === wrapper.toUpperCase() &&
          $(el.previousSibling).is(wrapper + ':not([class])')
        ) {
          $(el.previousSibling).append($(el).text())
          $(el).remove()
        }
        $(el).wrap(`<${wrapper}>`)
      }
    })
}

export const prependToNearest = (
  $: CheerioAPI,
  parentSelector: string,
  childSelector: string,
  type: 3 | string
) => {
  $(parentSelector)
    .contents()
    .each((i, el) => {
      if (typeof type === 'number' && el.nodeType !== type) return
      if (typeof type === 'string' && $(el).prop('tagName') !== type.toUpperCase()) return
      const text = typeof type === 'string' ? $(el).prop('outerHTML') : $(el).text()
      $(el).next(childSelector).prepend(text)
      $(el).remove()
    })
}

export const insertSiblingIfNotExists = (
  $: CheerioAPI,
  mainSelector: string,
  siblingSelector: string,
  elementToInsert: string
) => {
  $(mainSelector).each((i, el) => {
    if (!$(el).siblings(siblingSelector).length) $(el).after(elementToInsert)
  })
}

export const deserializeHTML = (
  $: CheerioAPI,
  mainSelector: string,
  selectorIndex: number,
  addStyle: (tag: string, attributes: Record<string, string>) => string,
  addMarks: (
    tag: string,
    attributes: Record<string, string>,
    oldMarkDefs: Record<string, unknown>[]
  ) => [string[], Record<string, unknown>[]]
) => {
  return $(mainSelector)
    .eq(selectorIndex)
    .contents()
    .filter((i, el) => el.nodeType === 1)
    .map((i, mainEl) => {
      const mainAttributes = $(mainEl).attr()
      const mainTag = ($(mainEl).prop('tagName') || '').toLowerCase()
      const markDefs = []

      return {
        _type: 'block',
        style: addStyle(mainTag, mainAttributes),
        children: $(mainEl)
          .contents()
          .filter((i, el) => el.nodeType === 1)
          .map((i, childEl) => {
            const childAttributes = $(childEl).attr()
            const childTag = ($(childEl).prop('tagName') || '').toLowerCase()

            const [marks, markDef] = addMarks(childTag, childAttributes, markDefs)
            markDefs.push(...markDef)

            return {
              _type: 'span',
              text: $(childEl).text(),
              marks
            }
          })
          .toArray(),
        markDefs
      }
    })
    .toArray()
}
