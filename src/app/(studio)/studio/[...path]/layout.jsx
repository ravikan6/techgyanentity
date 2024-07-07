import { StudioPathLayoutWrapper } from "@/components/studio/wrappers";

const StudioExpendedLayout = ({ children, params }) => {
    const { path } = params;

    return (
        <StudioPathLayoutWrapper path={decodeURIComponent(path[0])} >
            {children}
        </StudioPathLayoutWrapper>
    )
}

export default StudioExpendedLayout;