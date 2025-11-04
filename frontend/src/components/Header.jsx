import React from 'react'
import { Link } from 'react-router-dom'


export default function Header(){
return (
<header className="header">
<div className="brand">Potion Makers</div>
<nav>
<Link to="/">Home</Link>
<Link to="/shop">Shop</Link>
<Link to="/inventory">Inventory</Link>
<Link to="/recipes">Recipes</Link>
<Link to="/auth">Login</Link>
</nav>
</header>
)
}