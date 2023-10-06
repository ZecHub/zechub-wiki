import { ReactNode, FC } from "react"
import { Navigation, Footer } from "./";

const Layout: FC<{ children: ReactNode }> = ({ children }) => {

    return (
        <>
            <div>
                <Navigation />
            </div>
            <div>
                {children}
            </div>
            <div className="w-full">
                <Footer />
            </div>
        </>
    )
}

export default Layout;