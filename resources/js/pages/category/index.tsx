import { Category, CategoryCompany, getColumns } from '@/components/category/columns';
import { DataTable } from '@/components/consolidated/data-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import CreateCategory from './create';
import CreateCategoryCompany from './createCategoryCompany';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Gestion de Seguridad y Salud Ocupacional',
        href: '/admin/category',
    },
];

const handleActionClick = (item: CategoryCompany, action: string) => {
};

export default function Security() {
    const { categories } = usePage<{ categories: Category[] }>().props;
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
    const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleCreateClick = (categoryId: number, title: string) => {
        setSelectedCategoryId(categoryId);
        setSelectedCategoryName(title);
        setIsDialogOpen(true);
    };

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (scrollContainer) {
            const scrollPosition = scrollContainer.scrollTop;
            return () => {
                scrollContainer.scrollTop = scrollPosition;
            };
        }
    }, [categories]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Gestion SSO" />
            <div ref={scrollRef} className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <CreateCategory />
                <div className="grid grid-cols-1 gap-2 md:grid-cols-1 lg:grid-cols-2">
                    {categories.map((category, index) => (
                        <Card key={index}>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="flex-1">{category.nombre}</CardTitle>
                                <Button size={'sm'} className="ml-4" onClick={() => handleCreateClick(category.id, category.nombre)}>
                                    Crear {category.nombre}
                                </Button>
                            </CardHeader>

                            <CardContent>
                                <DataTable columns={getColumns(handleActionClick)} data={category.category_companies} />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
            {selectedCategoryId !== null && (
                <CreateCategoryCompany
                    categoryId={selectedCategoryId}
                    title={selectedCategoryName}
                    isDialogOpen={isDialogOpen}
                    setIsDialogOpen={setIsDialogOpen}
                />
            )}
        </AppLayout>
    );
}
