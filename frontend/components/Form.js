import React, { useEffect, useState } from 'react'
import * as yup from 'yup'
import axios from 'axios'

// 👇 Here are the validation errors you will use with Yup.
const validationErrors = {
  fullNameTooShort: 'full name must be at least 3 characters',
  fullNameTooLong: 'full name must be at most 20 characters',
  sizeIncorrect: 'size must be S or M or L'
}

// 👇 Here you will create your schema.
const formSchema = yup.object().shape({
  fullName: yup
  .string()
  .trim()
  .min(3, validationErrors.fullNameTooShort)
  .max(20, validationErrors.fullNameTooLong)
  .required(),
  size: yup
  .string()
  .required()
  .trim()
  .oneOf(['S' , 'M', 'L'], validationErrors.sizeIncorrect),
})


// 👇 This array could help you construct your checkboxes using .map in the JSX.
const toppings = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
]


const getInitialValues = () => ({
  fullName: '',
  size: '',
  toppings: [],
})

const getInitialErrors = () => ({
  fullName: '', 
  size: '',
  toppings: [],
})

export default function Form() {

  const [values, setValues] = useState(getInitialValues())
  const [errors, setErrors]  = useState(getInitialErrors())
  const [serverSuccess, setServerSuccess] = useState()
  const [serverFailure, setServerFailure] = useState()
  const [formEnabled, setFormEnabled] = useState(false)


  useEffect(() => {
    formSchema.isValid(values).then(setFormEnabled)
  })

  const onChange = evt => {
    let {type, id, value, checked} = evt.target
    value = type == 'checkbox'? checked : value
    setValues( {...values , [id] : value})
    yup.reach(formSchema, id).validate(value)
    .then(() => setErrors({...errors, [id]: ''}))
    .catch((err) => setErrors({...errors, [id]: err.errors[0]}))
  }

  const changeToppings = evt => {
    let { type, topping_id, checked, name } = evt.target
    if (type === 'checkbox') {
      let updatedToppings
      if (checked) {
        updatedToppings = [...values.toppings, name]
      } else {
        updatedToppings = values.toppings.filter(topping_id => topping_id !== name)
      }
      setValues({ ...values, toppings: updatedToppings })
    } else {
      const value = evt.target.value;
      setValues({ ...values, [topping_id]: value })
    }
  }

  const onSubmit = evt => {
    evt.preventDefault()
    axios.post('http://localhost:9009/api/order', values)
    .then(res =>{
      setServerSuccess(res.data.message)
      setServerFailure()
    })
    .catch(err => {
      setServerFailure(err.response.data.message)
      setServerSuccess()
    })
    .finally(() => {
      setValues(getInitialValues())
    })
  }

  return (
    <form onSubmit = {onSubmit}>
      <h2>Order Your Pizza</h2>
      {serverSuccess && <div className='success'>{serverSuccess}</div>}
      {serverFailure && <div className='failure'>{serverFailure}</div>}

      <div className="input-group">
        <div>
          <label htmlFor="fullName">Full Name</label><br />
          <input value={values.fullName} onChange={onChange} id="fullName" type="text" placeholder="Type full name" />
        </div>
        {errors.fullName && <div className='error'>{errors.fullName}</div>}
      </div>

      <div className="input-group">
        <div>
          <label htmlFor="size">Size</label><br />
          <select id="size" value = {values.size} onChange ={onChange}>
            <option value="">----Choose Size----</option>
            <option value = "S">Small</option>
            <option value = "M">Medium</option>
            <option value = "L">Large</option>
          </select>
        </div>
        {errors.size && <div className='error'>{errors.size}</div>}
      </div>

      <div className="input-group">
      {toppings.map((topping, index) => (
          <label key={index}>
            <input
              checked={values.toppings.includes(topping.topping_id)}
              onChange={changeToppings}
              name={topping.topping_id}
              type="checkbox"
            />
            {topping.text} <br />
            </label>
        ))}
        
      </div>
      {/* 👇 Make sure the submit stays disabled until the form validates! */}
      <input disabled={!formEnabled} type="submit" />
    </form>
  )
}
