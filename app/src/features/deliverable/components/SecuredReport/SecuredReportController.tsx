import SecuredReportPasswordForm from "./SecuredReportPasswordForm";
import { useSecuredLinkAuth } from "../../lib/securedLinkAuth";
import SecuredReport from "./SecuredReport";

export default function SecuredReportController({ linkToken }: { linkToken: string }) {
    const { isLoading, isAuthenticated, jwtToken } = useSecuredLinkAuth(linkToken);

    if (isLoading) {
        return null;
    }

    if (isAuthenticated && jwtToken) {
        return (<SecuredReport linkToken={linkToken} jwtToken={jwtToken} />);
    }

    return (
        <SecuredReportPasswordForm linkToken={linkToken} />
    );
}