import { ProductsComponent } from './../products/products.component';
import { Product } from './../model/product.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.css'],
})
export class EditProductComponent implements OnInit {
  productId!: string;
  product!: Product;
  productFormGroup!: FormGroup;
  constructor(
    private route: ActivatedRoute,
    public productService: ProductService,
    private fb: FormBuilder
  ) {
    this.productId = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.productService.getProduct(this.productId).subscribe({
      next: (product) => {
        this.product = product;
        this.productFormGroup = this.fb.group({
          name: this.fb.control(this.product.name, [
            Validators.required,
            Validators.minLength(4),
          ]),
          price: this.fb.control(this.product.price, [
            Validators.required,
            Validators.min(200),
          ]),
          promotion: this.fb.control(this.product.promotion, [
            Validators.required,
          ]),
        });
      },
    });
  }

  handleUpdateProduct() {
    let p = this.productFormGroup.value; // Recupère les données du produit
    p.id = this.product.id; // Lui attribut un ID
    this.productService.updateProduct(p).subscribe({
      next: (product) => {
        alert('Product updated successfully');
        this.productFormGroup.reset();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
