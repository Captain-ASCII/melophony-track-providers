
import { format } from '@utils/StringUtils'

export class FileNotFoundError extends Error {
  private filename: string

  constructor(message: string, filename: string) {
    super(format(message, filename))
    this.filename = filename
  }

  getFilename(): string {
    return this.filename
  }
}


export class MissingRequiredFieldError extends Error {
  private missingFields: Array<string>

  constructor(message: string, missingFields: Array<string>) {
    super(format(message, missingFields))
    this.missingFields = missingFields
  }

  getMissingFields(): Array<string> {
    return this.missingFields
  }
}