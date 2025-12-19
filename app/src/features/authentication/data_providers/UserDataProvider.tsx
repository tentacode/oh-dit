import { ReactNode, useEffect } from "react";
import CardSkeleton from "@/src/components/skeleton/CardSkeleton";
import ErrorBox from "../../error_handling/components/ErrorBox";
import { useFetchTeams } from "../queries/useFetchTeams";
import { useTeamsStateStore } from "../store/teamsStore";

export default function UserDataProvider({
  children,
}: {
  children: ReactNode;
}) {
  const {
    data: teams,
    isLoading: isLoadingTeams,
    isError: isErrorTeams,
  } = useFetchTeams();

  const { setTeams, setCurrentTeamUuid } = useTeamsStateStore();
  const currentTeamUuid = useTeamsStateStore((state) => state.currentTeamUuid);

  useEffect(() => {
    if (teams) {
      setTeams(teams);

      if (teams.length > 0 && !currentTeamUuid) {
        setCurrentTeamUuid(teams[0].uuid);
      }
    }
  }, [teams, setTeams, setCurrentTeamUuid, currentTeamUuid]);

  if (isLoadingTeams)
    return <CardSkeleton />;

  if (isErrorTeams || !teams || teams.length === 0)
    return (
      <ErrorBox message="Une erreur est survenue lors du chargement de votre compte." />
    );

  return <>{children}</>;
}
