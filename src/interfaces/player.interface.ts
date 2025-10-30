export interface Player {
    id: number,
    name: string,
    lastname: string,
    position: string,
    shirtNumber: number,
    playerImageUrl: string
}


export interface PlayerStatistic {
    id: number,
    name: string,
    lastname: string,
    position: string,
    team: string,
    shirtNumber: number,
    minutesPlayed: number,
    goalsNumber: number,
    goalAverage: number,
    soccerGoalShotsPercentage: number,
    soccerGoalShots: number,
    shotsNumber: number,
    coveredDistance: number,
    playerImageUrl: string ,
    heatmapUrl: string
}