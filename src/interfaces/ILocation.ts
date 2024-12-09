export interface ILocation {
    place_id: string;
    address: string;
    latitude: number;
    longitude: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ICreateLocationRequest {
    place_id: string;
}

export interface ILocationResponse {
    place_id: string;
    address: string;
    latitude: number;
    longitude: number;
    createdAt: string;
    updatedAt: string;
}
