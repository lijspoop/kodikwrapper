interface VideoLinksErrorOptions {
    code: string;
    description: string;
    data?: unknown;
    cause?: unknown;
}
declare class VideoLinksError extends Error {
    /** Error code */
    code: string;
    /** Error stack */
    stack: string;
    /** Error data */
    data?: unknown;
    /** Error cause */
    cause?: unknown;
    constructor({ code, description, data, cause }: VideoLinksErrorOptions);
    get [Symbol.toStringTag](): string;
    toJSON(): Pick<this, keyof this>;
}

type AllowArray<T> = T | T[];
type Nullable<T> = T | null;
type ObjectOrUnknown<T extends boolean, O> = T extends true ? O : unknown;

type MaterialMovieType = 'foreign-movie' | 'soviet-cartoon' | 'foreign-cartoon' | 'russian-cartoon' | 'anime' | 'russian-movie';
type MaterialSerialType = 'cartoon-serial' | 'documentary-serial' | 'russian-serial' | 'foreign-serial' | 'anime-serial' | 'multi-part-film';
type MaterialType = MaterialMovieType | MaterialSerialType;
type ExternalDatabase = 'kinopoisk_id' | 'imdb_id' | 'mdl_id' | 'worldart_link' | 'shikimori_id';
type ExternalDatabaseGenresType = 'kinopoisk' | 'shikimori' | 'mydramalist' | 'all';
type RatingMPAA = 'G' | 'PG' | 'PG-13' | 'R' | 'R+' | 'Rx';
type AnimeKind = 'tv' | 'movie' | 'ova' | 'ona' | 'special' | 'music' | 'tv_13' | 'tv_24' | 'tv_48';
type AnimeStatus = 'anons' | 'ongoing' | 'released';
type TranslationType = 'voice' | 'subtitles';
interface Translation {
    id: number;
    title: string;
    type: TranslationType;
}
interface FilterByExternalDatabase {
    countries?: AllowArray<string>;
    genres?: AllowArray<string>;
    anime_genres?: AllowArray<string>;
    drama_genres?: AllowArray<string>;
    all_genres?: AllowArray<string>;
    duration?: string | number;
    kinopoisk_rating?: number | string;
    imdb_rating?: number | string;
    shikimori_rating?: number | string;
    mydramalist_rating?: number | string;
    actors?: AllowArray<number | string>;
    directors?: AllowArray<number | string>;
    producers?: AllowArray<number | string>;
    writers?: AllowArray<number | string>;
    composers?: AllowArray<number | string>;
    editors?: AllowArray<number | string>;
    designers?: AllowArray<number | string>;
    operators?: AllowArray<number | string>;
    rating_mpaa?: AllowArray<RatingMPAA>;
    minimal_age?: number | string;
    anime_kind?: AllowArray<AnimeKind>;
    anime_status?: AllowArray<AnimeStatus>;
    drama_status?: AllowArray<AnimeStatus>;
    all_status?: AllowArray<AnimeStatus>;
    anime_studios?: AllowArray<string>;
    anime_licensed_by?: AllowArray<string>;
}
interface MaterialData {
    title?: string;
    anime_title?: string;
    title_en?: string;
    other_titles?: string[];
    other_titles_en?: string[];
    other_titles_jp?: string[];
    anime_license_name?: string;
    anime_licensed_by?: string[];
    anime_kind?: AnimeKind;
    all_status?: AnimeStatus;
    anime_status?: AnimeStatus;
    drama_status?: AnimeStatus;
    year?: number;
    tagline?: string;
    description?: string;
    anime_description?: string;
    poster_url?: string;
    screenshots?: string[];
    duration?: number;
    countries?: string[];
    all_genres?: string[];
    genres?: string[];
    anime_genres?: string[];
    drama_genres?: string[];
    anime_studios?: string[];
    kinopoisk_rating?: number;
    kinopoisk_votes?: number;
    imdb_rating?: number;
    imdb_votes?: number;
    shikimori_rating?: number;
    shikimori_votes?: number;
    mydramalist_rating?: number;
    mydramalist_votes?: number;
    premiere_ru?: string;
    premiere_world?: string;
    aired_at?: string;
    released_at?: string;
    next_episode_at?: string;
    rating_mpaa?: RatingMPAA;
    minimal_age?: number;
    episodes_total?: number;
    episodes_aired?: number;
    actors?: string[];
    directors?: string[];
    producers?: string[];
    writers?: string[];
    composers?: string[];
    editors?: string[];
    designers?: string[];
    operators?: string[];
}
interface SharedFields {
    types?: AllowArray<MaterialType>;
    year?: AllowArray<number>;
    block_translations?: AllowArray<number>;
    translation_id?: AllowArray<number>;
    translation_type?: TranslationType;
    has_field?: AllowArray<ExternalDatabase>;
    has_field_and?: boolean;
    lgbt?: boolean;
    sort?: 'title' | 'count';
}
interface EpisodeDataObject {
    title?: string;
    link: string;
    screenshots: string[];
}
interface EpisodesObject {
    [episode: string | number]: string | EpisodeDataObject;
}
interface SeasonObject {
    link: string;
    title?: string;
    episodes?: EpisodesObject;
}
interface SeasonsObject {
    [season: string | number]: SeasonObject;
}
interface BlockedSeasonsObject {
    [season: string | number]: 'all' | string[];
}
interface TranslationV1Object {
    id: number;
    title: string;
    type: TranslationType;
}
interface MaterialObject {
    id: string;
    title: string;
    title_orig: string;
    other_title: string;
    link: string;
    year: number;
    kinopoisk_id: string | number;
    imdb_id: string | number;
    mdl_id: string | number;
    worldart_link: string;
    shikimori_id: number;
    type: MaterialType;
    quality: string;
    caprip: boolean;
    lgbt: boolean;
    translation: TranslationV1Object;
    created_at: string;
    updated_at: string;
    blocked_countries: string[];
    seasons?: SeasonsObject;
    last_season?: number;
    last_episode?: number;
    episodes_count?: number;
    blocked_seasons?: BlockedSeasonsObject | 'all';
    screenshots: string[];
    material_data?: MaterialData;
}
interface SharedSearchListFields {
    limit?: number;
    camrip?: boolean;
    with_seasons?: boolean;
    with_episodes?: boolean;
    with_episodes_data?: boolean;
    with_page_links?: boolean;
    not_blocked_in?: AllowArray<string>;
    not_blocked_for_me?: boolean;
    with_material_data?: boolean;
    next?: string;
}
interface KodikResponse<T> {
    time: string;
    total: number;
    results: T;
}
interface KodikResponseWithPagination<T> extends KodikResponse<T> {
    prev_page: Nullable<string>;
    next_page: Nullable<string>;
}

interface CountriesParams extends FilterByExternalDatabase, SharedFields {
}
interface CountriesResponseObject {
    title: string;
    count: number;
}
type CountriesResponse = KodikResponse<CountriesResponseObject[]>;

interface GenresParams extends FilterByExternalDatabase, SharedFields {
    genres_type?: ExternalDatabaseGenresType;
}
interface GenresResponseObject {
    title: string;
    count: number;
}
type GenresResponse = KodikResponse<GenresResponseObject[]>;

interface ListParams extends FilterByExternalDatabase, Omit<SharedFields, 'sort'>, SharedSearchListFields {
    sort?: 'year' | 'created_at' | 'updated_at' | 'kinopoisk_rating' | 'imdb_rating' | 'shikimori_rating';
    order?: 'asc' | 'desc';
}
type ListResponse = KodikResponseWithPagination<MaterialObject[]>;

interface QualitiesParams {
}
interface QualitiesV2Params extends FilterByExternalDatabase, SharedFields {
}
interface QualityObject {
    title: string;
    count: number;
}
type QualitiesResponse = (Pick<QualityObject, 'title'>)[];
type QualitiesV2Response = KodikResponse<QualityObject[]>;

interface SearchParams extends FilterByExternalDatabase, Omit<SharedFields, 'sort'>, SharedSearchListFields {
    title?: string;
    title_orig?: string;
    strict?: boolean;
    full_match?: boolean;
    id?: string;
    player_link?: string;
    kinopoisk_id?: number;
    imdb_id?: string;
    mdl_id?: string;
    worldart_animation_id?: number;
    worldart_cinema_id?: number;
    worldart_link?: string;
    shikimori_id?: number;
    prioritize_translations?: AllowArray<TranslationType | string | number>;
    unprioritize_translations?: AllowArray<TranslationType | string | number>;
    prioritize_translation_type?: TranslationType;
    season?: number;
    episode?: number;
}
type SearchResponse = KodikResponse<MaterialObject[]>;

interface TranslationsParams {
}
interface TranslationsV2Params extends FilterByExternalDatabase, Omit<SharedFields, 'translation_id'> {
}
interface TranslationV2Object {
    id: number;
    title: string;
    count: number;
}
type TranslationsResponse = TranslationV1Object[];
type TranslationsV2Response = KodikResponse<TranslationV2Object[]>;

interface YearsParams extends FilterByExternalDatabase, Omit<SharedFields, 'year'> {
}
interface YearsResponseObject {
    title: string;
    count: number;
}
type YearsResponse = KodikResponse<YearsResponseObject[]>;

interface APIMethods {
    countries(params?: CountriesParams): Promise<CountriesResponse>;
    genres(params?: GenresParams): Promise<GenresResponse>;
    list(params?: ListParams): Promise<ListResponse>;
    qualities(params?: QualitiesParams): Promise<QualitiesResponse>;
    qualitiesV2(params?: QualitiesV2Params): Promise<QualitiesV2Response>;
    search(params?: SearchParams): Promise<SearchResponse>;
    translations(params?: TranslationsParams): Promise<TranslationsResponse>;
    translationsV2(params?: TranslationsV2Params): Promise<TranslationsV2Response>;
    years(params?: YearsParams): Promise<YearsResponse>;
}

interface ClientOptions {
    token: string;
    kodikApiUrl?: string;
}
declare const KODIK_API_URL = "https://kodikapi.com";
declare class ClientError extends Error {
    name: string;
}
declare class Client {
    KODIK_API_URL: string;
    constructor({ token, kodikApiUrl }: ClientOptions);
    static fromToken(token: string, options?: Omit<ClientOptions, 'token'>): Client;
}
interface Client extends APIMethods {
}

declare const KODIK_PLAYER_DOMAIN = "kodik.info";
declare const KODIK_VIDEO_INFO_ENDPOINT = "/ftor";
interface KodikParsedLinkExUrlParams {
    d: string;
    d_sign: string;
    pd: string;
    pd_sign: string;
    ref: string;
    ref_sign: string;
    translations: boolean;
    advert_debug: boolean;
    min_age: number;
    first_url: boolean;
}
interface KodikParsedLinkExTranslation {
    id: number;
    title: string;
}
interface KodikParsedLinkExSkipButtons {
    type: string;
    data: string;
}
type KodikVideoSourceQuality = '1080' | '720' | '480' | '360' | '240' | string;
interface KodikVideoSource {
    src: string;
    type: string;
}
type KodikVideoLinks = Record<KodikVideoSourceQuality, KodikVideoSource[]>;
interface KodikParsedLinkEx {
    urlParams: KodikParsedLinkExUrlParams;
    playerSingleUrl?: string;
    translation: KodikParsedLinkExTranslation;
    skipButtons?: KodikParsedLinkExSkipButtons;
}
interface VideoLinksParseParams<Extended extends boolean = false> {
    link: string;
    extended?: Extended;
}
type KodikParsedLink<Extended extends boolean = false> = {
    host: string;
    type: string;
    id: string;
    hash: string;
    quality: string;
} & ObjectOrUnknown<Extended, Record<'ex', KodikParsedLinkEx>>;
interface VideoLinksGetLinksParams {
    link: string;
    videoInfoEndpoint?: string;
}
declare const kodikPlayerLinkRegexp: RegExp;
declare class VideoLinks {
    static parseLink<Extended extends boolean>({ extended, link }: VideoLinksParseParams<Extended>): Promise<KodikParsedLink<Extended>>;
    static normalizeKodikLink(input: string): string;
    static getActualVideoInfoEndpoint(playerSingleUrl: string): Promise<string>;
    static getLinks({ link, videoInfoEndpoint }: VideoLinksGetLinksParams): Promise<KodikVideoLinks>;
    static parseSkipButtons: (skipButtons: KodikParsedLinkExSkipButtons) => {
        from: string;
        to: string;
    }[];
}

export { type AnimeKind, type AnimeStatus, type BlockedSeasonsObject, Client, ClientError, type ClientOptions, type CountriesParams, type CountriesResponse, type CountriesResponseObject, type EpisodeDataObject, type EpisodesObject, type ExternalDatabase, type ExternalDatabaseGenresType, type FilterByExternalDatabase, type GenresParams, type GenresResponse, type GenresResponseObject, KODIK_API_URL, KODIK_PLAYER_DOMAIN, KODIK_VIDEO_INFO_ENDPOINT, type KodikParsedLink, type KodikParsedLinkEx, type KodikParsedLinkExSkipButtons, type KodikParsedLinkExTranslation, type KodikParsedLinkExUrlParams, type KodikResponse, type KodikResponseWithPagination, type KodikVideoLinks, type KodikVideoSource, type KodikVideoSourceQuality, type ListParams, type ListResponse, type MaterialData, type MaterialMovieType, type MaterialObject, type MaterialSerialType, type MaterialType, type QualitiesParams, type QualitiesResponse, type QualitiesV2Params, type QualitiesV2Response, type QualityObject, type RatingMPAA, type SearchParams, type SearchResponse, type SeasonObject, type SeasonsObject, type SharedFields, type SharedSearchListFields, type Translation, type TranslationType, type TranslationV1Object, type TranslationV2Object, type TranslationsParams, type TranslationsResponse, type TranslationsV2Params, type TranslationsV2Response, VideoLinks, VideoLinksError, type VideoLinksErrorOptions, type VideoLinksGetLinksParams, type VideoLinksParseParams, type YearsParams, type YearsResponse, type YearsResponseObject, kodikPlayerLinkRegexp };
