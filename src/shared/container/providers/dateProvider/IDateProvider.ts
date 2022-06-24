interface IDateProvider {

    dateNow(): Date
    convertToDate(date: string | Date): Date
    addOrSubtractTime(operation: string, timeUnit: string, amountOfTime: number, date?: string | Date,): Date
    IsToday(date: Date): boolean
    isValidDate(date: string | Date): boolean
    formatDate(date: Date, formatType: string): Date
    compareDiferenceInHours(start_date: Date, end_date: Date): number
    compareIfBefore(start_date: Date, end_date: Date): boolean
}

export { IDateProvider }