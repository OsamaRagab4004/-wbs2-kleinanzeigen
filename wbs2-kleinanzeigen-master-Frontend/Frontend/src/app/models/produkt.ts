import { Kategorie } from "../enums/kategorie"
import { User } from "./user"

export class Produkt {
    id: number = -1
    name: string = ""
    beschreibung: string = ""
    kategorie: Kategorie = Kategorie.SONSTIGES
    preis: number = 0
    verkaeufer?: User
    verhandelbar: boolean = false
    istVerkauft: boolean = false
}
