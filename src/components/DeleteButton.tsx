export const DeleteButton = ({
  onDelete,
  taskId,
  className = '',
}: {
  onDelete: (taskId: string) => void
  taskId: string
  className?: string
}) => (
  <button
    aria-label="삭제"
    className={`delete-button ${className}`.trim()}
    onClick={(event) => {
      event.stopPropagation()
      onDelete(taskId)
    }}
    title="삭제"
    type="button"
  >
    <span aria-hidden="true">×</span>
  </button>
)
