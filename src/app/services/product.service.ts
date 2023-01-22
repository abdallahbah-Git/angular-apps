import { Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { UUID } from 'angular2-uuid';
import { Observable, of, throwError } from 'rxjs';
import { PageProducts, Product } from '../model/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private products!: Array<Product>;

  constructor() {
    this.products = [
      { id: UUID.UUID(), name: 'Computer', price: 1500, promotion: true },
      { id: UUID.UUID(), name: 'Printer', price: 500, promotion: false },
      { id: UUID.UUID(), name: 'Smart Phone', price: 2500, promotion: true },
    ];
    for (let i = 0; i < 10; i++) {
      this.products.push({
        id: UUID.UUID(),
        name: 'Computer',
        price: 1500,
        promotion: true,
      });
      this.products.push({
        id: UUID.UUID(),
        name: 'Printer',
        price: 500,
        promotion: false,
      });
      this.products.push({
        id: UUID.UUID(),
        name: 'Printer',
        price: 500,
        promotion: false,
      });
    }
  }

  // Méthode pour récupérer les produits
  public getAllProducts(): Observable<Array<any>> {
    // Création de l'erreur
    let rnd = Math.random();
    if (rnd < 0.1) return throwError(() => new Error('Products not found'));
    else return of(...[this.products]);
  }

  // Méthode pour récupérer les produits par page
  public getPageProducts(page: number, size: number): Observable<PageProducts> {
    let index = page * size;
    let totalPages = ~~(this.products.length / size);
    if (this.products.length % size != 0) {
      totalPages++;
    }
    let pageProducts = this.products.slice(index, index + size);
    return of({
      page: page,
      size: size,
      totalPages: totalPages,
      products: pageProducts,
    });
  }

  // Connaitre l'id pour supprimer
  public deleteProduct(id: string): Observable<boolean> {
    this.products = this.products.filter((p) => p.id != id);
    return of(true);
  }

  // Activer ou Désactiver une promotion
  public setPromotion(id: string): Observable<boolean> {
    let product = this.products.find((p) => p.id == id);
    if (product != undefined) {
      product.promotion != product.promotion;
      return of(true);
    } else return throwError(() => new Error('Product not found'));
  }

  // Recherche un produit à travers un mot clé
  public searchProducts(keyword: string, page: number, size: number): Observable<PageProducts> {
    let result = this.products.filter((p) => p.name.includes(keyword));
    let index = page * size;
    let totalPages = ~~(result.length / size);
    if (this.products.length % size != 0) {
      totalPages++;
    }
    let pageProducts = result.slice(index, index + size);
    return of({
      page: page,
      size: size,
      totalPages: totalPages,
      products: pageProducts,
    });
  }



  // Ajoute un nouveau produit
  public addNewProduct(product: Product) : Observable<Product> {
    product.id = UUID.UUID();
    this.products.push(product);
    return of(product);
  }

  // Recupère un nouveau produit
  public getProduct(id: string) : Observable<Product> {
    let product = this.products.find(p => p.id == id);
    if(product == undefined) return throwError(() => new Error ("Product not found"));
    return of(product);
    
  }

  // Met à jour le produit
  public updateProduct(product : Product) : Observable<Product> {
   this.products = this.products.map(p => (product.id == p.id) ? product: p);
   return of (product);
  }

  // Gère les erreurs lors de la saisie des champs du formulaire "Ajout"
  getErrorMessage(fieldName: string, error: ValidationErrors) {
    if(error['required']) {
      return fieldName + ' is required';
    }else if(error['minlength']) {
      return fieldName + ' should have at least ' + error['minlength']['requiredLength'] + ' characters';
    }else if(error['min']) {
      return fieldName + ' should have a min value of ' + error['min']['min'];
    }else return '';

  }


}
