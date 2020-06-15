
import FileSystem from 'fs'
import Path from 'path'

function removeDir(path: string): void {
  if (FileSystem.existsSync(path)) {
    FileSystem.readdirSync(path).forEach((file) => {
      const curPath = Path.join(path, file)
      if (FileSystem.lstatSync(curPath).isDirectory()) {
        removeDir(curPath)
      } else {
        FileSystem.unlinkSync(curPath)
      }
    })
    FileSystem.rmdirSync(path)
  }
}

export { removeDir }