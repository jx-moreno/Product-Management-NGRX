import { createAction, createFeatureSelector, createReducer, createSelector, on } from "@ngrx/store";
import { User } from "../user";
import * as UserActions from './user.actions';
// State for this feature (User)
export interface UserState {
    maskUserName: boolean;
    currentUser: User;
  }
  
  const initialState: UserState = {
    maskUserName: true,
    currentUser: null
  };
  
  // Selector functions
  const getUserFeatureState = createFeatureSelector<UserState>('users');
  
  export const getMaskUserName = createSelector(
    getUserFeatureState,
    state => state.maskUserName
  );
  
  export const getCurrentUser = createSelector(
    getUserFeatureState,
    state => state.currentUser
  );

export const userReducer = createReducer(
    initialState,
    on(UserActions.maskUserName, (state): UserState => {
        return{
            ...state,
            maskUserName : !state.maskUserName
        };
    })
);