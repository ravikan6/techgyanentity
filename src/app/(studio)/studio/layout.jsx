import * as StudioMainLayout from '@/components/studio/_layout';
import { StudioHeader } from '@/components/studio/_header';
import { StudioMainLayoutWrapper } from '@/components/studio/wrappers';
import { auth } from '@/lib/auth';
import { DecryptAuthorStudioCookie } from '@/lib/actions/studio';

export function metadata() {
    return {
        title: 'Creator Studio',
        description: 'Creator Studio',
    }
}

const StudioExpendedLayout = async ({ children }) => {
    const session = await auth();
    let authorData = null;

    if (session && session.user) {
        authorData = await DecryptAuthorStudioCookie();
    }

    return (
        <StudioMainLayoutWrapper authorData={authorData} session={session} >
            <StudioMainLayout.default session={session} >
                <StudioHeader lang='en' />
                <section aria-labelledby='page-content'>
                    {children}
                </section>
            </StudioMainLayout.default>
        </StudioMainLayoutWrapper>
    );
};

export default StudioExpendedLayout;