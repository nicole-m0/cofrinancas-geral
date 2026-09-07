import { PageHeader } from '@/components/PageHeader';
import { listUsersWithKpis, requireAdminSession } from '@/lib/data';
import { UsersManager } from './UsersManager';

export const dynamic = 'force-dynamic';

export default async function UsuariosPage() {
  await requireAdminSession();
  const rows = await listUsersWithKpis();

  return (
    <>
      <PageHeader
        title="Usuários"
        subtitle={`${rows.length} contas · ${rows.filter((u) => u.status === 'ativo').length} ativas`}
      />
      <UsersManager initialRows={rows} />
    </>
  );
}
