import SubjectWorkspace from '@/components/subject/SubjectWorkspace'

export default async function SubjectChapterPage(props: { params: Promise<{ id: string; chapterId: string }> }) {

  const { id, chapterId } = await props.params

  return <SubjectWorkspace subjectId={id} chapterId={chapterId} />

}
