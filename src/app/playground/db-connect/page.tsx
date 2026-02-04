import { createClient } from "@/utils/supabase/server";
import UsersView from "./features/db-connect-table";

export default async function Page() {
    const supabase = await createClient();

    const { data: memberTypes } = await supabase
        .from("member-types")
        .select("id, type_name");

    const { data: users } = await supabase.from("master_users").select(`
      id,
      first_name,
      last_name,
      email,
      users_finance (
        total_income,
        current_balance,
        limits
      )
    `);

    return <UsersView memberTypes={memberTypes || []} users={users || []} />;
}
