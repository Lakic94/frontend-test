export interface Planet {
    id: number;
    planetName: string;
    planetColor: string;
    planetRadiusKM: number;
    distInMillionsKM: {
        fromSun: number;
        fromEarth: number;
    };
    description: string;
    imageUrl: string;
    imageName: string;
}
