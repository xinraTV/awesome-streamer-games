import fs from 'fs'

const BEGIN_MARKER = '<!-- TABLE BEGIN -->'
const END_MARKER = '<!-- TABLE END -->'

console.log('Generating data.json from README.md')

const readme = fs.readFileSync('README.md', 'utf8')

const table = readme.substring(readme.indexOf(BEGIN_MARKER) + BEGIN_MARKER.length, readme.indexOf(END_MARKER)).trim()

const rows = table.split('\n').map(row => row.split('|').map(cell => cell.trim()).slice(1)).slice(2)

function parseLink(str) {
  const match = /^\[(.*)\]\((.*)\)$/.exec(str)
  if (!match) {
    return { label: str }
  }
  return {
    label: match[1],
    url: match[2],
  }
}

const data = rows.map(row => ({
  name: parseLink(row[0]),
  developer: parseLink(row[1]),
  streamLanguage: row[2],
  status: row[3],
  genres: row[4].split(',').map(genre => genre.trim()),
}))

fs.writeFileSync('src/generated/data.json', JSON.stringify(data, null, 2))

console.log(`Parsed ${data.length} games`)
