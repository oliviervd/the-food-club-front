import {useEffect} from "react";

const LinkComponent = ({children}) => {
    useEffect(()=>{
        const links = document.querySelectorAll('.link');
        links.forEach(link => {
            link.addEventListener('click', function() {
                this.classList.add('clicked');
                setTimeout(() => {
                    this.classList.remove('clicked');
                }, 200);
            });
        });
    },[])

    return <div className={"link"}>
        {children}
    </div>
}

export default LinkComponent