import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ImagenesEspecialidadService {
  private unsplashAccessKey = 'z8WMF7BkT63UDNtFh0KRrm3F-d-d83DfIVwn4vqI_BI';
  private unsplashApiUrl = 'https://api.unsplash.com/search/photos';

  constructor(private http: HttpClient) {}

  searchImages(query: string): Observable<string[]> {
    const headers = new HttpHeaders({
      Authorization: `Client-ID ${this.unsplashAccessKey}`
    });

    const params = new HttpParams({
      fromObject: {
        query: `${query} medical`, // Añade "medical" al final para mejorar la precisión de la búsqueda
        per_page: '5' // Número de imágenes por página que deseas obtener
      }
    });

    return this.http.get<any>(this.unsplashApiUrl, { headers, params }).pipe(
      map(response => response.results.map((result: any) => result.urls.regular))
    );
  }
}
