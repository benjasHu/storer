import path from 'path'
import fs from 'fs'

export default function(publicPath, dest, filename='rev-manifest.json') {

  return function() {
    this.plugin("done", stats => {
      var stats = stats.toJson(),
          chunks = stats.assetsByChunkName,
          manifest = {};
      for (var key in chunks) {
        manifest[publicPath + key + '.js'] = publicPath + chunks[key]
      }
      fs.writeFileSync(
        path.join(process.cwd(), dest, filename),
        JSON.stringify(manifest)
      )
    })
  }
}
