import { Product } from './../model/product.model';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  // products = [
  //   { id: 1, name: 'Computer', price: 1500 },
  //   { id: 2, name: 'Printer', price: 500 },
  //   { id: 3, name: 'Iphone 14', price: 2500 },
  // ];

  // products: Array<any> | undefined;
  products!: Array<Product>;
  currentPage: number = 0;
  pageSize: number = 5;
  totalPages: number = 0;
  currentAction: string = 'all';
  errorMessage!: string;
  searchFormGroup!: FormGroup;
  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    public authService: AuthenticationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.searchFormGroup = this.fb.group({
      keyword: this.fb.control(null),
    });
    // this.handleGetAllProducts();
    this.handleGetPageProducts();
  }

  // Récuperer tous les produits
  handleGetAllProducts() {
    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => {
        this.errorMessage = err;
      },
    });
  }

  // Récuperer une partie des produits
  handleGetPageProducts() {
    this.productService
      .getPageProducts(this.currentPage, this.pageSize)
      .subscribe({
        next: (data) => {
          this.products = data.products;
          this.totalPages = data.totalPages;
        },
        error: (err) => {
          this.errorMessage = err;
        },
      });
  }

  // Aller à la page de
  gotoPage(i: number) {
    this.currentPage = i;
    if (this.currentAction == 'all') this.handleGetPageProducts();
    else this.handleSearchProducts();
  }

  // Supprimer un produit
  handleDeleteProduct(p: Product) {
    let conf = confirm('Are you sure you want to delete ?');
    if (conf === false) return;
    this.productService.deleteProduct(p.id).subscribe({
      next: (data) => {
        //this.handleGetAllProducts();
        let index = this.products.indexOf(p);
        this.products.splice(index, 1);
      },
    });
  }

  //Activer ou desactiver une promotion
  handleSetPromotion(p: Product) {
    let promo = p.promotion;
    this.productService.setPromotion(p.id).subscribe({
      next: (data) => {
        p.promotion = !promo;
      },
      error: (err) => {
        this.errorMessage;
      },
    });
  }

  //Rechercher un produit à partir d'un mot clé
  handleSearchProducts() {
    this.currentAction = 'search';
    this.currentPage = 0;
    let keyword = this.searchFormGroup.value.keyword;
    this.productService
      .searchProducts(keyword, this.currentPage, this.pageSize)
      .subscribe({
        next: (data) => {
          this.products = data.products;
          this.totalPages = data.totalPages;
        },
      });
  }

  // Ajoute un nouveau produit
  handleNewProduct() {
    this.router.navigateByUrl('/admin/new-product');
  }

  //Modifie un produit existant
  handleEditProduct(p: Product) {
    this.router.navigateByUrl('/admin/edit-product/' + p.id);
  }

}
