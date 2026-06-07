export interface Episode {
    videoPath: string;
    posterPath: string;
    title: string;
    description: string;
    rating: string;
  }
  
  export interface Season {
    number: number;
    title: string;
    episodes: Episode[];
  }