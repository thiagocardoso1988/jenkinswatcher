const path = require('path')

const FOLDER_BASE = path.parse(__filename).dir
const FOLDER_SRC = path.join(FOLDER_BASE, 'src')
const FOLDER_ASSETS = path.join(FOLDER_BASE, 'assets')
const APPICON = path.join(FOLDER_ASSETS, 'icons', 'png', '256x256.png')
// const FOO = 'bar';
module.exports = {
  test: path.parse(__filename),
  FOLDER_BASE,
  FOLDER_SRC,
  FOLDER_ASSETS,
  APPICON
}
