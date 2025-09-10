export function FormError({ error }: { error: string }) {
  return (
    <div className="text-red-500 text-sm bg-red-50 p-3 rounded-md w-full">
      {error}
    </div>
  );
}
