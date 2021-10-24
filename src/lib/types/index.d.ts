export interface Movie {
	budget: number;
	genres: string[];
	id: number;
	overview: string | null;
	poster_path: string | null;
	production_companies: string[];
	release_date: string;
	revenue: number;
	runtime: number | null;
	tagline: string | null;
	title: string;

	cast: Credit[];
	crew: Credit[];
}

export interface Credit {
	name: string;
	role: string;
}
