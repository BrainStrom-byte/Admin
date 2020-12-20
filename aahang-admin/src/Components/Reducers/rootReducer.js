
import { combineReducers } from "redux";
import categoryPageReducer from "./categoryPageReducer";
import categoryReducer from "./categoryReducer";

const DEFAULT_REDUCER =(initstate,action)=>{
    return{
        key:"HELLOW WORLD",
    };
};

const rootReducer = combineReducers({
DEFAULT: DEFAULT_REDUCER,
categories: categoryReducer,
categoryPages : categoryPageReducer,
});

export default rootReducer;