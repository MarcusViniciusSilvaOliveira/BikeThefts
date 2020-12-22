import { configureStore } from '@reduxjs/toolkit';
import ListaBicicletasReducer from '../features/ListaBicicletas/ListaBicicletasReducer.d.ts';

export default configureStore({
  reducer: {
    bicicletas: ListaBicicletasReducer,
  },
});
