export interface SpotifyResponseForTracks {
    href: string;
    limit: number;
    next: string | null;
    offset: number;
    previous: string | null;
    total: number;
    items : TrackObject[]
}



export interface TrackObject {
    album: Album;
    artists: ArtistObject[];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: ExternalIds;
    external_urls: ExternalUrls;
    href: string;
    id: string;
    is_playable: boolean;
    restrictions: Restrictions;
    name: string;
    popularity: number;
    preview_url: string | null;
    track_number: number;
    type: string;
    uri: string;
    is_local: boolean;
}

export interface Album {
    album_type: string;
    total_tracks: number;
    available_markets: string[];
    external_urls: ExternalUrls;
    href: string;
    id: string;
    images: Image[];
    name: string;
    release_date: string;
    release_date_precision: string;
    restrictions?: Restrictions;
    type: string;
    uri: string;
    artists: SimplifiedArtistObject[];
}

export interface ExternalUrls {
    spotify: string;
}

export interface Image {
    url: string;
    height: number | null;
    width: number | null;
}

export interface Restrictions {
    reason: string;
}

export interface SimplifiedArtistObject {
    external_urls: ExternalUrls;
    href: string;
    id: string;
    name: string;
    type: string;
    uri: string;
}

export interface ArtistObject extends SimplifiedArtistObject {
    followers: Followers;
    genres: string[];
    images: Image[];
    popularity: number;
}

export interface Followers {
    href: string | null;
    total: number;
}

export interface ExternalIds {
    isrc?: string;
    ean?: string;
    upc?: string;
}