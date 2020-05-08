import React, { createContext,useReducer } from "react";

//initial state

const initialState = {
    transaction : [
        { id : 1 , text : 'Flowers' ,amount : -20},
        { id : 2 , text : 'Salary' ,amount : 300},
        { id : 3 , text : 'Book' ,amount : -200}
    ]
}

//create context

export const GlobalContext = createContext(initialState)

//provider context 

export const GlobalProvider = ({children}) =>{
    const [state, dispatch] = useReducer(reducer, initialState)
    
//actions

function deleteTranscation(id) {
    dispatch ({
        type : 'Delete_Transaction',
        payload : id
    })
}

function addTranscation(transaction) {
    dispatch ({
        type : 'Add_Transaction',
        payload : transaction
    })
}
    
    return(
    <GlobalContext.Provider value = {{transaction : state.transaction , deleteTranscation , addTranscation } }>
        {children}
    </GlobalContext.Provider>)
}

//reducer

const reducer =(state,action) => {
    switch(action.type){
        case  'Delete_Transaction':
            return{
                ...state,
                transaction : state.transaction.filter(transaction => transaction.id !== action.payload)
            }
        case 'Add_Transaction' : 
            return{
                ...state,
                transaction : [action.payload, ...state.transaction] 
            }
        default:
            return state;
    }
} 
