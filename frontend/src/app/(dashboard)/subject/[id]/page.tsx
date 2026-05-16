import SubjectWorkspace from '@/components/subject/SubjectWorkspace'

export default async function SubjectPage(props: { params: Promise<{ id: string }> }) {

  const { id } = await props.params

  return <SubjectWorkspace subjectId={id} />

}
