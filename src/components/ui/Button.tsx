import { Url } from "@octokit/types";
import Router from "next/router";
import { ReactNode } from "react";

interface props{
    children: ReactNode
    url: Url 
    classes?: string
}

const Button = ({url, children, classes}: props) => (
    <button onClick={()=>Router.push(`site/${url}`)} className={classes} >
        {children}
    </button>
)

export default Button