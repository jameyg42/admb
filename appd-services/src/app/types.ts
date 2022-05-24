export interface App {
    id: number,
    name?: string,
    type?: string
}

export type Season = ('NONE'| 'DAILY' | 'WEEKLY' | 'MONTHLY')
export interface Baseline {
    id: number,
    name?: string,
    defaultBaseline?: boolean,
    seasonality?: Season,
    numberOfDays?: number
}
