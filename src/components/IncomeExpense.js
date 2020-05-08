import React, {useContext} from 'react'
import { GlobalContext } from './GlobalState';


function IncomeExpense() {
    const { transaction } = useContext(GlobalContext)

    const amount = transaction.map(transactions => transactions.amount);

    const income = amount.filter(item => item > 0)
                        .reduce((acc,item) => (acc+item),0).toFixed(2)

    const expense = amount.filter(item => item < 0)
                        .reduce((acc,item) => (acc+item),0).toFixed(2) 
    return (
        <div className = "inc-exp-container">
            <div>
                <h4>Income</h4>
                <p id =" money-plus" className ="money-plus"> +${income} </p>
            </div>
            <div>
                <h4>Expense</h4>
                <p id =" money-minus" className ="money-minus"> {expense} </p>
            </div>
        </div>
    )
}

export default IncomeExpense
