import { Category, getColumns } from '@/components/category/columns';
import { DataTable } from '@/components/consolidated/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState } from 'react';
import CreateCategory from './create';
import CreateCategoryCompany from './createCategoryCompany';
import CreateGroup from './createGroupCompany';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestion de Seguridad y Salud Ocupacional',
        href: '/admin/category',
    },
];

export default function Security() {
    const { categories } = usePage<{ categories: Category[] }>().props;

    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [isGroupDialogOpen, setIsGroupDialogOpen] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState<{
        id: number | null;
        name: string | null;
        isCategorized: string | null;
        groups: any[];
    }>({
        id: null,
        name: null,
        isCategorized: null,
        groups: [],
    });

    const handleCategoryClick = (categoryId: number, title: string, isCategorized: string, groups: any[]) => {
        setSelectedCategory({
            id: categoryId,
            name: title,
            isCategorized,
            groups,
        });
        setIsCategoryDialogOpen(true);
    };

    const handleGroupClick = (categoryId: number, title: string, isCategorized: string, groups: any[]) => {
        setSelectedCategory({
            id: categoryId,
            name: title,
            isCategorized,
            groups,
        });
        setIsGroupDialogOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestion SSO" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <CreateCategory />
                <div className="grid grid-cols-1 gap-2 md:grid-cols-1 lg:grid-cols-2">
                    {[...categories].reverse().map(({ id, nombre, is_categorized, category_companies, groups }, index) => (
                        <Card key={index}>
                            <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                <CardTitle className="flex-1">{nombre}</CardTitle>
                                <div className="flex flex-col gap-2 md:flex-row">
                                    {is_categorized === '1' && (
                                        <Button size="sm" variant="secondary" onClick={() => handleGroupClick(id, nombre, is_categorized, groups)}>
                                            Crear Grupo
                                        </Button>
                                    )}
                                    <Button size="sm" className="md:ml-4" onClick={() => handleCategoryClick(id, nombre, is_categorized, groups)}>
                                        Crear {nombre}
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <DataTable columns={getColumns(() => {}, groups)} data={category_companies} />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
            {selectedCategory.id !== null && (
                <>
                    <CreateCategoryCompany
                        categoryId={selectedCategory.id}
                        title={selectedCategory.name!}
                        isDialogOpen={isCategoryDialogOpen}
                        setIsDialogOpen={setIsCategoryDialogOpen}
                        isCategorized={selectedCategory.isCategorized}
                        groups={selectedCategory.groups}
                    />
                    <CreateGroup
                        categoryId={selectedCategory.id}
                        title={selectedCategory.name!}
                        isDialogOpen={isGroupDialogOpen}
                        setIsDialogOpen={setIsGroupDialogOpen}
                    />
                </>
            )}
        </AppLayout>
    );
}
