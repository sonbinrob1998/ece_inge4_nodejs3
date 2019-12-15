import encoding from 'encoding-down'
import leveldown from 'leveldown'
import levelup from 'levelup'
import fs = require('fs')
import del = require('del')

export class LevelDB {

    //opens a connection to the database
  static open(path: string) {
    const encoded = encoding(
      leveldown(path),
      { valueEncoding: 'json' }
    )
    return levelup(encoded)
  }

    //closes the connection to the database
  static clear(path: string) {
    if (fs.existsSync(path)) {
      del.sync(path, { force: true })
    }
  }

}
