import { prisma } from '@/lib/db/prisma';
import PackageManagementClient from '@/components/admin/PackageManagementClient';

export const revalidate = 0;

export default async function AdminPackagesPage() {
  const packages = await prisma.package.findMany({
    orderBy: { price: 'desc' },
  });

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-mono font-bold tracking-widest text-gold-400 uppercase">
          PACKAGE MANAGEMENT
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-1">
          Manage Photography Packages
        </h1>
      </div>

      <PackageManagementClient initialPackages={packages} />
    </div>
  );
}
