export const BOOKS_DATA = [
  {
    id: 'Gen',
    name: 'Genesis'
  },
  {
    id: 'Exod',
    name: 'Exodus'
  },
  {
    id: 'Lev',
    name: 'Leviticus'
  },
  {
    id: 'Num',
    name: 'Numbers'
  },
  {
    id: 'Deut',
    name: 'Deuteronomy'
  },
  {
    id: 'Josh',
    name: 'Joshua'
  },
  {
    id: 'Judg',
    name: 'Judges'
  },
  {
    id: 'Ruth',
    name: 'Ruth'
  },
  {
    id: '1Sam',
    name: '1 Samuel'
  },
  {
    id: '2Sam',
    name: '2 Samuel'
  },
  {
    id: '1Kgs',
    name: '1 Kings'
  },
  {
    id: '2Kgs',
    name: '2 Kings'
  },
  {
    id: '1Chr',
    name: '1 Chronicles'
  },
  {
    id: '2Chr',
    name: '2 Chronicles'
  },
  {
    id: 'Ezra',
    name: 'Ezra'
  },
  {
    id: 'Neh',
    name: 'Nehemiah'
  },
  {
    id: 'Esth',
    name: 'Esther'
  },
  {
    id: 'Job',
    name: 'Job'
  },
  {
    id: 'Ps',
    name: 'Psalms'
  },
  {
    id: 'Prov',
    name: 'Proverbs'
  },
  {
    id: 'Eccl',
    name: 'Ecclesiastes'
  },
  {
    id: 'Song',
    name: 'Song of Solomon'
  },
  {
    id: 'Isa',
    name: 'Isaiah'
  },
  {
    id: 'Jer',
    name: 'Jeremiah'
  },
  {
    id: 'Lam',
    name: 'Lamentations'
  },
  {
    id: 'Ezek',
    name: 'Ezekiel'
  },
  {
    id: 'Dan',
    name: 'Daniel'
  },
  {
    id: 'Hos',
    name: 'Hosea'
  },
  {
    id: 'Joel',
    name: 'Joel'
  },
  {
    id: 'Amos',
    name: 'Amos'
  },
  {
    id: 'Obad',
    name: 'Obadiah'
  },
  {
    id: 'Jonah',
    name: 'Jonah'
  },
  {
    id: 'Mic',
    name: 'Micah'
  },
  {
    id: 'Nah',
    name: 'Nahum'
  },
  {
    id: 'Hab',
    name: 'Habakkuk'
  },
  {
    id: 'Zeph',
    name: 'Zephaniah'
  },
  {
    id: 'Hag',
    name: 'Haggai'
  },
  {
    id: 'Zech',
    name: 'Zechariah'
  },
  {
    id: 'Mal',
    name: 'Malachi'
  },
  {
    id: 'Matt',
    name: 'Matthew'
  },
  {
    id: 'Mark',
    name: 'Mark'
  },
  {
    id: 'Luke',
    name: 'Luke'
  },
  {
    id: 'John',
    name: 'John'
  },
  {
    id: 'Acts',
    name: 'Acts'
  },
  {
    id: 'Rom',
    name: 'Romans'
  },
  {
    id: '1Cor',
    name: '1 Corinthians'
  },
  {
    id: '2Cor',
    name: '2 Corinthians'
  },
  {
    id: 'Gal',
    name: 'Galatians'
  },
  {
    id: 'Eph',
    name: 'Ephesians'
  },
  {
    id: 'Phil',
    name: 'Philippians'
  },
  {
    id: 'Col',
    name: 'Colossians'
  },
  {
    id: '1Thess',
    name: '1 Thessalonians'
  },
  {
    id: '2Thess',
    name: '2 Thessalonians'
  },
  {
    id: '1Tim',
    name: '1 Timothy'
  },
  {
    id: '2Tim',
    name: '2 Timothy'
  },
  {
    id: 'Titus',
    name: 'Titus'
  },
  {
    id: 'Phim',
    name: 'Philemon'
  },
  {
    id: 'Heb',
    name: 'Hebrews'
  },
  {
    id: 'Jas',
    name: 'James'
  },
  {
    id: '1Pet',
    name: '1 Peter'
  },
  {
    id: '2Pet',
    name: '2 Peter'
  },
  {
    id: '1John',
    name: '1 John'
  },
  {
    id: '2John',
    name: '2 John'
  },
  {
    id: '3John',
    name: '3 John'
  },
  {
    id: 'Jude',
    name: 'Jude'
  },
  {
    id: 'Rev',
    name: 'Revelation'
  }
]

const BOOKS_ID_MAP = new Map([
  ...BOOKS_DATA.map((i): [string, string] => [i.id.toLowerCase(), i.id]),
  ...BOOKS_DATA.map((i): [string, string] => [i.name.toLowerCase(), i.id])
])

const BOOKS_NAME_MAP = new Map([
  ...BOOKS_DATA.map((i): [string, string] => [i.id.toLowerCase(), i.name]),
  ...BOOKS_DATA.map((i): [string, string] => [i.name.toLowerCase(), i.name])
])

export const BOOKS = {
  data: BOOKS_DATA,
  getId: (val: string): string => {
    return BOOKS_ID_MAP.get(val.toLowerCase())
  },
  getName: (val: string): string => {
    return BOOKS_NAME_MAP.get(val.toLowerCase())
  }
}

export const VERSIONS_DATA = [
  {
    id: 'KJ21',
    name: '21st Century King James Version'
  },
  {
    id: 'ASV',
    name: 'American Standard Version'
  },
  {
    id: 'AMP',
    name: 'Amplified Bible'
  },
  {
    id: 'AMPC',
    name: 'Amplified Bible, Classic Edition'
  },
  {
    id: 'BRG',
    name: 'BRG Bible'
  },
  {
    id: 'CSB',
    name: 'Christian Standard Bible'
  },
  {
    id: 'CEB',
    name: 'Common English Bible'
  },
  {
    id: 'CJB',
    name: 'Complete Jewish Bible'
  },
  {
    id: 'CEV',
    name: 'Contemporary English Version'
  },
  {
    id: 'DARBY',
    name: 'Darby Translation'
  },
  {
    id: 'DLNT',
    name: 'Disciples’ Literal New Testament'
  },
  {
    id: 'DRA',
    name: 'Douay-Rheims 1899 American Edition'
  },
  {
    id: 'ERV',
    name: 'Easy-to-Read Version'
  },
  {
    id: 'EHV',
    name: 'Evangelical Heritage Version'
  },
  {
    id: 'ESV',
    name: 'English Standard Version'
  },
  {
    id: 'ESVUK',
    name: 'English Standard Version Anglicised'
  },
  {
    id: 'GNV',
    name: '1599 Geneva Bible'
  },
  {
    id: 'GW',
    name: 'GOD’S WORD Translation'
  },
  {
    id: 'GNT',
    name: 'Good News Translation'
  },
  {
    id: 'HCSB',
    name: 'Holman Christian Standard Bible'
  },
  {
    id: 'ICB',
    name: 'International Children’s Bible'
  },
  {
    id: 'ISV',
    name: 'International Standard Version'
  },
  {
    id: 'PHILLIPS',
    name: 'J.B. Phillips New Testament'
  },
  {
    id: 'JUB',
    name: 'Jubilee Bible 2000'
  },
  {
    id: 'KJV',
    name: 'King James Version'
  },
  {
    id: 'AKJV',
    name: 'Authorized (King James) Version'
  },
  {
    id: 'LEB',
    name: 'Lexham English Bible'
  },
  {
    id: 'TLB',
    name: 'Living Bible'
  },
  {
    id: 'MSG',
    name: 'The Message'
  },
  {
    id: 'MEV',
    name: 'Modern English Version'
  },
  {
    id: 'NOG',
    name: 'Names of God Bible'
  },
  {
    id: 'NABRE',
    name: 'New American Bible (Revised Edition)'
  },
  {
    id: 'NASB',
    name: 'New American Standard Bible'
  },
  {
    id: 'NASB1995',
    name: 'New American Standard Bible 1995'
  },
  {
    id: 'NCB',
    name: 'New Catholic Bible'
  },
  {
    id: 'NCV',
    name: 'New Century Version'
  },
  {
    id: 'NET Bible',
    name: 'New English Translation'
  },
  {
    id: 'NIRV',
    name: "New International Reader's Version"
  },
  {
    id: 'NIV',
    name: 'New International Version'
  },
  {
    id: 'NIVUK',
    name: 'New International Version - UK'
  },
  {
    id: 'NKJV',
    name: 'New King James Version'
  },
  {
    id: 'NLV',
    name: 'New Life Version'
  },
  {
    id: 'NLT',
    name: 'New Living Translation'
  },
  {
    id: 'NMB',
    name: 'New Matthew Bible'
  },
  {
    id: 'NRSV',
    name: 'New Revised Standard Version'
  },
  {
    id: 'NRSVA',
    name: 'New Revised Standard Version, Anglicised'
  },
  {
    id: 'NRSVACE',
    name: 'New Revised Standard Version, Anglicised Catholic Edition'
  },
  {
    id: 'NRSVCE',
    name: 'New Revised Standard Version Catholic Edition'
  },
  {
    id: 'NTE',
    name: 'New Testament for Everyone'
  },
  {
    id: 'OJB',
    name: 'Orthodox Jewish Bible'
  },
  {
    id: 'TPT',
    name: 'The Passion Translation'
  },
  {
    id: 'RGT',
    name: 'Revised Geneva Translation'
  },
  {
    id: 'RSV',
    name: 'Revised Standard Version'
  },
  {
    id: 'RSVCE',
    name: 'Revised Standard Version Catholic Edition'
  },
  {
    id: 'TLV',
    name: 'Tree of Life Version'
  },
  {
    id: 'VOICE',
    name: 'The Voice'
  },
  {
    id: 'WEB',
    name: 'World English Bible'
  },
  {
    id: 'WE',
    name: 'Worldwide English (New Testament)'
  },
  {
    id: 'WYC',
    name: 'Wycliffe Bible'
  },
  {
    id: 'YLT',
    name: "Young's Literal Translation"
  }
]

const VERSIONS_ID_MAP = new Map([
  ...VERSIONS_DATA.map((i): [string, string] => [i.id.toLowerCase(), i.id]),
  ...VERSIONS_DATA.map((i): [string, string] => [i.name.toLowerCase(), i.id])
])

const VERSIONS_NAME_MAP = new Map([
  ...VERSIONS_DATA.map((i): [string, string] => [i.id.toLowerCase(), i.name]),
  ...VERSIONS_DATA.map((i): [string, string] => [i.name.toLowerCase(), i.name])
])

export const VERSIONS = {
  data: VERSIONS_DATA,
  getId: (val: string): string => {
    return VERSIONS_ID_MAP.get(val?.toLowerCase())
  },
  getName: (val: string): string => {
    return VERSIONS_NAME_MAP.get(val?.toLowerCase())
  }
}
