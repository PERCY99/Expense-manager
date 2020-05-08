import React , {useContext} from 'react'
import { GlobalContext } from './GlobalState';

function Transaction(props) {
    const { deleteTranscation } = useContext(GlobalContext)
    const {transaction} = props;
    console.log(transaction)
    const sign  = transaction.amount < 0 ? '-' : '+'; 
    return (
        <li className = {sign === '+'? 'plus' : 'minus'}> {transaction.text} <span>{sign}${Math.abs(transaction.amount)}</span> <button onClick = {() => deleteTranscation(transaction.id)} className ="delete-btn"  >x</button>
        </li>
    )
}

export default Transaction
