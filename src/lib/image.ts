type PosterSize = 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original';

// docs: https://developers.themoviedb.org/3/getting-started/images
export function getPosterUrl(path: string, size: PosterSize): string {
	return `https://image.tmdb.org/t/p/${size}${path}`;
}
