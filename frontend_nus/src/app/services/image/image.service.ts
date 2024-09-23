import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Image } from 'src/app/common/image';

@Injectable({
    providedIn: 'root'
})
export class ImageService {
    private baseUrl = 'http://143.42.79.86/backend';

    constructor(private http: HttpClient) { }

    saveImage(imageData: { imageid: string; imageUrl: string; description: string; }): Observable<any> {
        return this.http.post<any>(`${this.baseUrl}/Products/saveImage`, imageData);
    }

    getAllImages(): Observable<Image[]> {
        return this.http.get<Image[]>(`${this.baseUrl}/Products/getAllImages`);
    }
}
