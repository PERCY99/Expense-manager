import React from 'react'
import { useState , useContext} from "react";
import { GlobalContext } from './GlobalState';
function AddTransaction() {
    const [text, setText] = useState('')
    const [amount, setAmount] = useState(0)
    const {addTranscation} = useContext(GlobalContext)
    const onSubmit = e =>{
        e.preventDefault(); 

        const newTransaction  = {
            id : Math.floor(Math.random()*10000), 
            text,
            amount : +amount
        }
        addTranscation(newTransaction)
    }
    return (
        <>
            <h3>Add new transaction</h3>
                <form onSubmit = {onSubmit}>
                    <div className ="form-control">
                        <label for = "text" >text</label>
                        <input type = "text" value = {text} onChange = { (e) => setText(e.target.value)} placeholder ="Enter Text..."></input>
                    </div>
                    <div className ="form-control">
                        <label for = "amount" >Amount<br /> ( negative - expense , positive - income)</label>
                        <input type="number"value = {amount} onChange = { (e) => setAmount(e.target.value)} placeholder="Enter amount..." />
                    </div>
                    <button className="btn">Add transaction</button>
                </form>  
        </>
    )
}
export default AddTransaction