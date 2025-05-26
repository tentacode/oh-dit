import CriterionValidation from '@/features/criterion/pages/CriterionValidation';

interface PageProps {
  params: Promise<{
    slug: string;
    criterionId: string;
  }>;
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function CriterionValidationPage({ params, searchParams }: PageProps) {
  const { slug, criterionId } = await params;
  const { page } = await searchParams;

  return (
    <CriterionValidation 
      projectSlug={slug}
      criterionId={criterionId}
      pageId={page}
    />
  );
} 