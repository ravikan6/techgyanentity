import { AuthLogin } from "@/components/auth/_login";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { CreateAccount } from "@/components/auth/_authclient";

const AuthPagesV2 = async ({ params, searchParams }) => {
    const session = await auth();
    const route = params.path;
    const path = params.path[0];
    const query = searchParams;

    // if (!session) {
    if (path === 'login') {
        return (
            <AuthLogin params={route} searchParams={query} />
        );
    } else if (path === 'signup') {
        return (
            <div>
                <CreateAccount />
            </div>
        )
    }
    // } else {
    //     let callback = query.callback ? query.callback : '/';
    //     redirect(callback);
    // }

}

export default AuthPagesV2;