import { useState } from 'react';
import { Plus, Trash2, Edit2, ShoppingBag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTenant } from '@/contexts/TenantContext';
import { getProductsByAcademia } from '@/data/mockData';

const ShopManagement = () => {
  const { tenant } = useTenant();
  const products = tenant ? getProductsByAcademia(tenant.id) : [];
  const hasShopFeature = tenant?.plan?.features.shop;

  if (!hasShopFeature) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Loja</h1>
        <Card>
          <CardContent className="py-12 text-center">
            <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">Funcionalidade não disponível</h3>
            <p className="text-muted-foreground">
              A loja está disponível apenas no plano Elite.
            </p>
            <Badge variant="outline" className="mt-4">Upgrade para Elite</Badge>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gerenciar Loja</h1>
        <Button><Plus className="mr-2 h-4 w-4" />Novo Produto</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="p-4">
              <div className="aspect-square bg-muted rounded-lg mb-4 flex items-center justify-center">
                {product.imageUrl ? (
                  <img src={product.imageUrl} alt={product.name} className="object-cover rounded-lg" />
                ) : (
                  <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                )}
              </div>
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
              <p className="text-lg font-bold mt-2">R$ {product.price.toFixed(2)}</p>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm"><Edit2 className="h-4 w-4" /></Button>
                <Button variant="outline" size="sm" className="text-destructive"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ShopManagement;
