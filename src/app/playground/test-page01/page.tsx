import { createClient } from '@/utils/supabase/server'

export default async function Page() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('member-types')
    .select('id, type_name')

  if (error) {
    return <pre>{error.message}</pre>
  }

  if (!data || data.length === 0) {
    return <p>No data found</p>
  }

  return (
    <ul>
      {data.map(row => (
        <li key={row.id}>
          {row.id} — {row.type_name}
        </li>
      ))}
    </ul>
  )
}
