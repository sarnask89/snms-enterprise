const SUFFIX_MAP: Record<string, string> = {
    kos: "Romana Koseły",
    kro: "Tadeusza Króla",
    krol: "Tadeusza Króla",
    mic: "Adama Mickiewicza",
    mac: "Ignacego Maciejowskiego",
    mil: "Milberta",
    sch: "Schinzla",
    cie: "Cieśli",
    slo: "Słowackiego",
    chwa: "os. Chwałki",
    ak: "Armii Krajowej",
    pils: "Piłsudskiego",
    kier: "Kierzkowska",
    krak: "Krakowska",
    m: "Mickiewicza",
    zar: "Zarzekowice",
    zam: "Zamkowa",
    obr: "Obrońców",
    zol: "Żółkiewskiego",
};

export type ParsedMikrotikComment = {
    externalId: string;
    lastName: string;
    apartmentNumber: string;
    streetName: string;
    streetNumber: string;
};

export function parseMikrotikComment(comment: string | null | undefined): ParsedMikrotikComment | null {
    const normalized = String(comment ?? "").trim();
    if (!normalized) {
        return null;
    }

    const pattern = /(\d+)\s+([A-Za-zÀ-ÿ-]+)\s+(?:(?:M\/|m\.\s*|m)(\d+)\s+)?([A-Za-z]+)\s*(\d+[A-Za-z]?)/i;
    const match = normalized.match(pattern);
    if (!match) {
        return null;
    }

    const shortcut = String(match[4] ?? "").toLowerCase();
    return {
        externalId: String(match[1] ?? ""),
        lastName: String(match[2] ?? "").charAt(0).toUpperCase() + String(match[2] ?? "").slice(1).toLowerCase(),
        apartmentNumber: String(match[3] ?? ""),
        streetName: SUFFIX_MAP[shortcut] ?? String(match[4] ?? ""),
        streetNumber: String(match[5] ?? "").toUpperCase(),
    };
}
