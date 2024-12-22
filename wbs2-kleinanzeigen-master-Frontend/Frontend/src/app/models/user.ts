export class User {
    id: number = -1
    vorname: string = ""
    nachname: string = ""
    email: string = ""
    markierteVerkaeufer?: Array<any> = []
    markierteProdukte?: Array<any> = []
    nutzerTyp: string = ""
    standNummer?: number = -1
    telefonNummer?: string = ""
}
