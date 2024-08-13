import { useState } from "react";
import PasswordInput from "../components/passwordinput";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../utils/helper";

const Register = () =>{
    const [name,setName] = useState("")
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("")
    const [address,setAddress] = useState("")
    const [role,setRole] = useState("USER")
    const [error,setError] = useState(null)
    const navigate = useNavigate()
    const handleRegister = (e) =>{
        e.preventDefault()
        if(!name){
            setError("Please enter your name.")
            return
        }
        if(!validateEmail(email)){
            setError("Please enter a valid email.")
            return
        }
        if(!password){
            setError("Please enter your password.")
            return
        }
        if(!address){
            setError("Please enter your address.")
            return
        }
        
    }
    return (
        <div className="flex items-center justify-center h-screen bg-image ">
                <div className="w-96 border rounded bg-white/30 px-7 py-10">
                    <form  onSubmit={handleRegister}>
                        <h4 className="text-2xl mb-7">Signup</h4>
                        <input type="text" placeholder="Name" className="input-box bg-white/30 text-black" value={name} onChange={(e) => setName(e.target.value)}/>
                        <input type="text" placeholder="Email" className="input-box bg-white/30 text-black" value={email} onChange={(e) => setEmail(e.target.value)}/>
                        <input type="text" placeholder="Address" className="input-box bg-white/30 text-black" value={address} onChange={(e) => setAddress(e.target.value)}/>
                        <PasswordInput  value={password} onChange={(e)=>setPassword(e.target.value)}/>
                        <button type="submit" className="btn-primary">Create Account</button>
                        {error && <p className="text-red text-xs pb-1">{error}</p>}
                        <p className="text-sm text-center mt-4">Already have an account ?{" "}
                        <Link to="/login" className="font-medium text-primary  underline">Login</Link></p>
                    </form>
                </div>
            </div>
    )
}

export default Register