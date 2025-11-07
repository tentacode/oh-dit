import { XCircleIcon
} from '@heroicons/react/24/outline'

export default function ErrorBox({message}: {message?: string}) {
    const errorMessage = message || "Une erreur est survenue. Veuillez réessayer plus tard.";

    return (
        <div className="gap-2 flex bg-red-100 border border-red-400 text-red-700 px-4 py-5 rounded-xl relative text-xl" role="alert">
            <div aria-hidden="true">
                <XCircleIcon className="size-14 mr-2" />
            </div>
            <div className="gap-1 flex flex-col">
                <strong className="font-bold">Erreur :</strong>
                <span>{errorMessage}</span>
                <span>Si le problème persiste, n&apos;hésitez pas à nous contacter à l&apos;adresse <a style={{textDecorationColor: 'red'}} href="mailto:support@ohdit.com">support@ohdit.com</a>.</span>
            </div>
        </div>
    );
    }