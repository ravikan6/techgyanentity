import { Header } from "@/components/header";

const WriteLayout = ({ children }) => {
    return (
        <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-[1000] bg-light dark:bg-dark">
            <Header />
            {children}
        </div>
    )
}

export default WriteLayout;