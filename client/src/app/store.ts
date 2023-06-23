import { configureStore, ThunkAction, Action, combineReducers } from '@reduxjs/toolkit';
import authReducer from '../redux/features/auth/authSlice';
import createSagaMiddleware from "redux-saga";
import logger from 'redux-logger';
import rootSaga from './rootSaga';

const rootReducer = combineReducers({
  auth: authReducer,
})

const sagaMiddleware = createSagaMiddleware();
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
    sagaMiddleware,
    logger
  ),
})

sagaMiddleware.run(rootSaga);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action
>