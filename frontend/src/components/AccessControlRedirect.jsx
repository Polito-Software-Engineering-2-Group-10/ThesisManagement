import { useNavigate } from 'react-router-dom';
import "../index.css"
import { useEffect } from 'react';

function AccessControlRedirect(props){
    const navigate = useNavigate();
    const { loggedIn, user, roles } = props;
    useEffect(() => {
        if (loggedIn) {
            if (!(user && user.role && roles.includes(user.role))) {
                console.log(`User ${user.role} is not authorized to access this page, redirecting...`);
                navigate('/');
            }
        } else {
            console.log(`Not logged in, redirecting...`);
            navigate('/');
        }
    }, [loggedIn, user]);
    return null;
}


export default AccessControlRedirect;