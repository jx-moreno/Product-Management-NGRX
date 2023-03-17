import { Injectable } from "@angular/core";

import { mergeMap, map, catchError, concatMap } from 'rxjs/operators';
import { ProductService } from "../product.service";

import { Actions, createEffect, ofType } from "@ngrx/effects";
import * as ProductActions from './product.action';
import { of } from "rxjs";
import { ProductModule } from "../product.module";

@Injectable()
export class ProductEffects {

    constructor(private actions$: Actions,
        private productService: ProductService) { }

    loadProducts$ = createEffect(() => {
        return this.actions$
        .pipe(
            ofType(ProductActions.loadProducts),
            mergeMap(() => this.productService.getProducts()
            .pipe(
                map(products => ProductActions.loadProductsSucess({ products })),
                //of creates a new observable dispatching a fail action
                catchError(error => of(ProductActions.loadProductsFailure({error})))
            ))
        )
    });

    updateProduct$ = createEffect(() =>{
        return this.actions$
        .pipe(
            ofType(ProductActions.updateProduct),
            concatMap(action =>
                this.productService.updateProduct(action.product)
                .pipe(
                    map(product => ProductActions.updateProductSuccess({product})),
                    catchError(error => of(ProductActions.updateProductFail({error})))
                    )
                )
        );
    });

    deleteProduct$ = createEffect(()=>{
        return this.actions$
        .pipe(
            ofType(ProductActions.deleteProduct),
            mergeMap(action => 
                this.productService.deleteProduct(action.productId)
                .pipe(
                    map(() => ProductActions.deleteProductSuccess({productId: action.productId})),
                    catchError(error => of(ProductActions.deleteProductFail({error})))
                )
                )
            );
    });

    createProduct$ = createEffect(()=>{
    return this.actions$.pipe(
        ofType(ProductActions.createProduct),
        concatMap(action => this.productService.createProduct(action.product).pipe(
            map(product => ProductActions.createProductSuccess({product})),
            catchError(error => of(ProductActions.createProductFail({error})))
            
        ))

    )
    })

}     