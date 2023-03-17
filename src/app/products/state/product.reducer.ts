import { Product } from "../product";

import { createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";

import * as AppState from '../../state/app.state';
import * as ProductActions from "./product.action";




export interface State extends AppState.State{
    products: ProductState;
};

export interface ProductState {
    showProductCode: boolean;
    currentProductId: number | null;
    products: Product[];
    error: string;
};

const initialState: ProductState ={
    showProductCode: true,
    currentProductId: null,
    products: [],
    error: ''
};

const getProductFeatureState = createFeatureSelector<ProductState>('products');

export const getShowProductCode = createSelector(
    getProductFeatureState,
    state => state.showProductCode
);
export const getCurrentProductId = createSelector(
    getProductFeatureState,
    state => state.currentProductId
);

export const getCurrentProduct = createSelector(
    getProductFeatureState,
    getCurrentProductId,
    (state, currentProductId) => {
        if (currentProductId === 0){
            return {
                id: 0,
                productName: '',
                productCode: 'New',
                description: '',
                starRating: 0
            };
        }else {
            return currentProductId ? state.products.find(p => p.id === currentProductId) : null;
        }
    }
);

export const getProducts = createSelector(
    getProductFeatureState,
    state => state.products
);

export const getError = createSelector(
    getProductFeatureState,
    state => state.error
);
export const productReducer = createReducer<ProductState>(
    initialState,
    on(ProductActions.toogleProductCode, (state): ProductState => {
        return {
            ...state,
            showProductCode: !state.showProductCode
        };
    }),
    on(ProductActions.setCurrentProduct, (state, action): ProductState =>{
        return {
            ...state,
            currentProductId: action.currentProductId
        };
    }),
    on(ProductActions.clearCurrentProduct, (state): ProductState =>{
        return{
            ...state,
            currentProductId: null
        };
    }),
    on(ProductActions.initializeCurrentProduct, (state, action): ProductState =>{
        return{
            ...state,
            currentProductId: 0
        };
    }),
    on(ProductActions.loadProductsSucess,(state, action): ProductState=>{
        return {
            ...state,
            products: action.products,
            error: ''
        }
    }),
    on(ProductActions.loadProductsFailure, (state, action): ProductState =>{
        return{
            ...state,
            products:[],
            error: action.error
        }
    }),
    on(ProductActions.updateProductSuccess, (state,action): ProductState =>{
        const updatedProducts = state.products.map(
            item => action.product.id === item.id ? action.product : item);
        return {
            ...state,
            products: updatedProducts,
            currentProductId: action.product.id,
            error:''
        };
    }),
    on(ProductActions.updateProductFail, (state,action): ProductState =>{
        return{
            ...state,
            error: action.error
        }
    }),
    on(ProductActions.deleteProductSuccess, (state,action): ProductState =>{

        return {
            ...state,
            products: state.products.filter(product=> product.id !== action.productId),
            currentProductId:null,
            error:''            
        }
    }),
    on(ProductActions.deleteProductFail, (state,action): ProductState =>{
        return{
            ...state,
            error: action.error
        }
    }),
    on(ProductActions.createProductSuccess, (state,action): ProductState =>{

        return {
            ...state,
            products: [...state.products, action.product],
            currentProductId: action.product.id,
            error:''            
        }
    }),
    on(ProductActions.createProductFail, (state,action): ProductState =>{
        return{
            ...state,
            error: action.error
        }
    }),

);
