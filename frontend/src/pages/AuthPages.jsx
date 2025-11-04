import React, { useState } from 'react'
import api from '../api'
import { useAuth } from '../utils/authProvider'


export default function AuthPages(){
const { login } = useAuth()
const [mode, setMode] = useState('login')
const [form, setForm] = useState({ username:'', password:'' })


async function submit(e){
e.preventDefault()
try{
const res = mode === 'login'
? await api.post('/auth/login', form)
: await api.post('/auth/register', form)
login(res.data.user)
alert('Success')
}catch(err){ alert('Auth failed') }
}


return (
<div className="auth">
<h2>{mode==='login' ? 'Login' : 'Register'}</h2>
<form onSubmit={submit}>
<input placeholder="username" value={form.username} onChange={e=>setForm({...form, username:e.target.value})} />
<input placeholder="password" type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
<button type="submit">{mode==='login' ? 'Login' : 'Register'}</button>
</form>
<button onClick={()=>setMode(mode==='login'?'register':'login')}>Switch to {mode==='login'?'register':'login'}</button>
</div>
)
}