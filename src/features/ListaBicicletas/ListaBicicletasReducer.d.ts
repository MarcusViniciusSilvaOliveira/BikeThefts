import { createSlice } from '@reduxjs/toolkit';
import { maskDateInput, getDateInMiliseconds } from '../../helper/util.js';

import { EndPoints } from '../../api/bikewise.js';

export const ListaBicicletasReducer = createSlice({
  name: 'ListaBicicletas',
  initialState: {
    searching: false,
    rowPerPage: 10,
    initialDateState: "",
    finalDateState: "",
    incidents: [],
    incidentSelected: null,
    paramsToSearch: {
      initialDate: 0,
      finalDate: 0,
      title: "",
      currentPage: 1
    },
    errorMensagem: ""
  },
  reducers: {
    selectIncident: (state, action) => {
      state.incidentSelected = action.payload;
    },
    changeTitle: (state, action) => {
      state.paramsToSearch.title = action.payload;
    },
    changePage: (state, action) => {
      state.paramsToSearch.currentPage += action.payload;
    },
    changeRowsPerPage: (state, action) => {
      state.paramsToSearch.rowPerPage = action.payload;
    },
    formatInitialDateMask: (state, action) => {
      state.initialDateState = maskDateInput(action.payload)
      state.paramsToSearch.initialDate = getDateInMiliseconds(action.payload);
    } ,
    formatFinalDateMask: (state, action) => {
      state.finalDateState = maskDateInput(action.payload)
      state.paramsToSearch.finalDate = getDateInMiliseconds(action.payload);
    },
    getIncidents: (state, action) => {
      state.searching = false;
      if(action.payload.incidents == null){
        state.errorMensagem = action.payload.message;
      }else{
        state.incidents = action.payload.incidents;
        state.paramsToSearch.currentPage = 1;
      }
    },
    searchingSomeData: (state, action) => {
      state.searching = action.payload;
    }
  },
});

export const { searchingSomeData, selectIncident, changeTitle, changeRowsPerPage, changePage, formatInitialDateMask, formatFinalDateMask, getIncidents } = ListaBicicletasReducer.actions;

export const SelectIncident = (incident) => (dispatch) => {
  dispatch(selectIncident(incident));
}
export const SearchIncidents = (_paramsToSearch) => (dispatch) => {
  dispatch(searchingSomeData(true));
  EndPoints.Get(_paramsToSearch).then((data : []) => {
    dispatch(getIncidents(data));
  });
}
export const ChangeTitle = (input) => (dispatch) => {
  dispatch(changeTitle(input));
}
export const ChangeInitialDate = dateInput => dispatch => {
  dispatch(formatInitialDateMask(dateInput));
}
export const ChangeFinalDate = dateInput => dispatch => {
  dispatch(formatFinalDateMask(dateInput));
}
export const GetInitialDate = state => { 
  return state.bicicletas.initialDateState;
}
export const GetFinalDate = state => { 
  return state.bicicletas.finalDateState;
}
export const GetState = state => { 
  return state.bicicletas;
}
export const ChangePage = (value) => dispatch => {
  dispatch(changePage(value));
}

export default ListaBicicletasReducer.reducer;
