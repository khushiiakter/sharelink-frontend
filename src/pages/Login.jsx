import { useContext } from "react";
import { AuthContext } from "../provider/AuthProvider";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const { handleGoogleLogin, user } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <>
            <dialog id="login_modal" className="modal modal-open">
                <div className="modal-box text-center space-y-6">
                    <h2 className="text-3xl font-bold mb-4">Welcome to ShareLink</h2>
                    <p className="mb-4">Sign in with Google to create and manage your links securely.</p>
                    <div className="modal-action flex justify-center">
                        <button 
                            onClick={handleGoogleLogin} 
                            className="py-3 mr-2 text-sm md:text-base text-white bg-[#5f1a89] font-semibold hover:bg-[#0F1035] rounded-full px-6 hover:border-white"
                        >
                            Sign in with Google
                        </button>
                        
                    </div>
                </div>
            </dialog>
            {user && navigate("/dashboard")}
        </>
    );
};

export default Login;
