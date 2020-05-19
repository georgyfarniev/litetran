const readline = require('readline')
const fs = require('fs')
const path = require('path')

const DIVIDER='\t'

async function main() {
  const langs = path.join(__dirname, 'langs.csv')
  const rl = readline.createInterface(fs.createReadStream(langs))
  const out = []

  for await (const lang of rl) {
    const [text, key] = lang.split(DIVIDER)
    out.push({text, key})
  }

  fs.writeFileSync(path.join(__dirname, 'directions.json'), JSON.stringify(out))
}

if (require.main === module) {
  main()
}
