import errorPageStyles from '@/src/design-system/styles/error/error_page.module.css';
import ErrorIllustration from './ErrorIllustration';

export default function ErrorPage({
    children
}: {
    children: React.ReactNode;
}) {
    return (<main className={errorPageStyles.pageContainer}>
        <ErrorIllustration />
        {children}
    </main>)
}