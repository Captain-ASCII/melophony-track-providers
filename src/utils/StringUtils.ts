
function format(baseString: string, ...args: any[]): string {
  let result = baseString
  for (const k in args) {
    result = result.replace('{' + k + '}', args[k])
  }
  return result
}

export { format }