interface FormAlertProps {
  error?: string;
  notice?: string;
}

/** Общее сообщение формы: ошибка или информация. */
export function FormAlert({ error, notice }: FormAlertProps) {
  if (error) {
    return (
      <p role="alert" className="rounded-control bg-danger-soft px-4 py-3 text-sm text-danger">
        {error}
      </p>
    );
  }
  if (notice) {
    return (
      <p role="status" className="rounded-control bg-success-soft px-4 py-3 text-sm text-success">
        {notice}
      </p>
    );
  }
  return null;
}
