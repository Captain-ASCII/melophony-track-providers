
import { promises as FileSystem } from 'fs'

async function getMp4FileDuration(filePath: string): Promise<number> {
  const buff = Buffer.alloc(100)
  const header = Buffer.from('mvhd')

  const file = await FileSystem.open(filePath, 'r')
  const { buffer } = await file.read(buff, 0, 100, 0)

  await file.close()

  const start = buffer.indexOf(header) + 17
  const timeScale = buffer.readUInt32BE(start)
  const duration = buffer.readUInt32BE(start + 4)

  const audioLength = Math.floor((duration / timeScale) * 1000) / 1000

  return Math.trunc(audioLength)
}

export { getMp4FileDuration }